import { NextResponse, type NextRequest } from 'next/server';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

import db from '@/lib/db';
import { AppraisalEmail } from '@/emails/appraisal-email';
import type { AppraisalFormValues } from '@/lib/schema';

// Increase the body size limit to handle multiple large image uploads
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

// This function now handles saving appraisal data to the database,
// storing images on the filesystem, and sending an email notification.
export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.APPRAISAL_FROM_EMAIL;
  const toEmail = process.env.APPRAISAL_TO_EMAIL;

  if (!fromEmail || !toEmail || !process.env.RESEND_API_KEY) {
    console.error('Missing environment variables for email sending.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    
    // Generate a unique ID for this submission
    const submissionId = crypto.randomBytes(8).toString('hex');
    
    const data: Record<string, any> = { id: submissionId };

    // Create a directory for this submission's uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', submissionId);
    await fs.mkdir(uploadDir, { recursive: true });

    // Process form fields and files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) {
          const fileBuffer = Buffer.from(await value.arrayBuffer());
          // Sanitize filename and give it a unique prefix to avoid collisions
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
          const cleanFilename = value.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
          const filename = `${key}-${uniqueSuffix}-${cleanFilename}`;
          const filePath = path.join(uploadDir, filename);

          await fs.writeFile(filePath, fileBuffer);
          // We don't need to store the path in memory anymore
        }
      } else {
        data[key] = value;
      }
    }
    
    // Prepare data for the database
    const dbData = { ...data };

    // Prepare SQL statement for insertion
    const columns = Object.keys(dbData).join(', ');
    const placeholders = Object.keys(dbData).map(() => '?').join(', ');
    const stmt = db.prepare(`INSERT INTO appraisals (${columns}) VALUES (${placeholders})`);
    
    // Execute the insertion
    stmt.run(...Object.values(dbData));

    // Render the React component to an HTML string
    const emailHtml = render(
      <AppraisalEmail 
        data={data as AppraisalFormValues} 
        submissionId={submissionId}
      />
    );
    
    // Also send a copy to the person who submitted it
    const recipientEmails = [toEmail, data.email].filter(Boolean);

    // Send the email using Resend
    await resend.emails.send({
      from: `Trade-In Vision <${fromEmail}>`,
      to: recipientEmails,
      subject: `New Appraisal Submission: #${submissionId}`,
      html: emailHtml,
    });

    return NextResponse.json({
      message: 'Appraisal submitted successfully!',
      submissionId: submissionId,
    });
  } catch (error: any) {
    console.error('Submission Error:', error);
    // Even if email fails, the submission was saved, so we can consider it a partial success
    // But it's better to inform the user something went wrong.
    return NextResponse.json(
      {
        message: 'An unexpected error occurred during submission.',
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
