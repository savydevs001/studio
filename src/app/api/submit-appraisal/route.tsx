// This file should be renamed to route.tsx to support JSX syntax.
import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { AppraisalEmail } from '@/emails/appraisal-email';
import type { AppraisalFormValues } from '@/lib/schema';

// Helper to convert a file to a Base64 string for email attachments
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}

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
    const data: Record<string, any> = {};
    const attachments: { filename: string; content: string }[] = [];

    // Process form fields and files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) {
           const content = await fileToBase64(value);
           attachments.push({ filename: value.name, content });
           data[key] = { name: value.name }; // Store file info for the email body
        }
      } else {
        data[key] = value;
      }
    }

    // Render the React component to an HTML string
    const emailHtml = render(<AppraisalEmail data={data as AppraisalFormValues} />);

    // Add user's email and the static email to the recipients list
    const recipientEmails = [toEmail, data.email, 'Mike@chevydude.com'];

    // Send the email using Resend
    const { data: sendData, error } = await resend.emails.send({
      from: `Trade-In Vision <${fromEmail}>`,
      to: recipientEmails,
      subject: `New Appraisal Request: ${data.year} ${data.make} ${data.model}`,
      html: emailHtml,
      attachments: attachments,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ message: 'Error sending email.', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Appraisal submitted successfully!', data: sendData });

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
