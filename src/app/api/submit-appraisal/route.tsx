import { NextResponse, type NextRequest } from 'next/server';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

import db from '@/lib/db';
import { AppraisalEmail } from '@/emails/appraisal-email';
import type { AppraisalFormValues } from '@/lib/schema';

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
    const imagePaths: Record<string, string> = {};

    // Create a directory for this submission's uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', submissionId);
    await fs.mkdir(uploadDir, { recursive: true });

    // Process form fields and files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) {
          const fileBuffer = Buffer.from(await value.arrayBuffer());
          const filePath = path.join(uploadDir, value.name);
          await fs.writeFile(filePath, fileBuffer);
          // Store the public path for the image
          imagePaths[key] = `/uploads/${submissionId}/${value.name}`;
        }
      } else {
        data[key] = value;
      }
    }
    
    // Prepare data for the database, excluding fields we don't want to store directly
    const dbData = { ...data };

    // Prepare SQL statement for insertion
    const columns = Object.keys(dbData).join(', ');
    const placeholders = Object.keys(dbData).map(() => '?').join(', ');
    const stmt = db.prepare(`INSERT INTO appraisals (${columns}) VALUES (${placeholders})`);
    
    // Execute the insertion
    stmt.run(...Object.values(dbData));

    // Render the React component to an HTML string
    // Pass submissionId and imagePaths to the email template
    const emailHtml = render(
      <AppraisalEmail 
        data={data as AppraisalFormValues} 
        submissionId={submissionId} 
        imagePaths={imagePaths} 
      />
    );
    
    const recipientEmails = [toEmail, data.email, 'Mike@chevydude.com'].filter(Boolean);

    // Send the email using Resend
    const { data: sendData, error } = await resend.emails.send({
      from: `Trade-In Vision <${fromEmail}>`,
      to: recipientEmails,
      subject: `Appraisal #${submissionId}: ${data.year} ${data.make} ${data.model}`,
      html: emailHtml,
      // No attachments needed anymore
    });

    if (error) {
      console.error('Resend Error:', error);
      // We still return a success response to the user since the data was saved
      return NextResponse.json({
        message: 'Appraisal submitted successfully!',
        submissionId: submissionId,
      });
    }

    return NextResponse.json({
      message: 'Appraisal submitted successfully!',
      submissionId: submissionId,
    });
  } catch (error: any) {
    console.error('Submission Error:', error);
    return NextResponse.json(
      {
        message: 'An unexpected error occurred.',
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
