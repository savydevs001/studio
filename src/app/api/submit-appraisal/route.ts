import { NextResponse, type NextRequest } from 'next/server';
import { AppraisalEmail } from '@/emails/appraisal-email';
import React from 'react';
import { render } from '@react-email/render';

// This configures the route to run on the Edge Runtime.
export const runtime = 'edge';

const resendApiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.APPRAISAL_TO_EMAIL;
const fromEmail = process.env.APPRAISAL_FROM_EMAIL;

// Helper function to convert a file to a Base64 string
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

export async function POST(request: NextRequest) {
  if (!resendApiKey || !toEmail || !fromEmail) {
    return NextResponse.json({ 
        message: 'Email configuration is missing. Please contact support.' 
    }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const data: { [key: string]: any } = {};
    const attachments: { filename: string; content: string }[] = [];

    // Use Promise.all to handle all file conversions concurrently
    const filePromises: Promise<void>[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        filePromises.push(
          fileToBase64(value).then(base64Content => {
            attachments.push({ filename: value.name, content: base64Content });
            data[key] = value.name; // Keep filename for email template
          })
        );
      } else {
        data[key] = value;
      }
    }

    await Promise.all(filePromises);

    const emailHtml = render(React.createElement(AppraisalEmail, { data }));

    const emailPayload = {
      from: `Trade-In Vision <${fromEmail}>`,
      to: [toEmail],
      subject: `New Appraisal Request: ${data.year} ${data.make} ${data.model}`,
      html: emailHtml,
      attachments: attachments,
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API Error:', responseData);
      return NextResponse.json({ message: 'Error sending email.', error: responseData.message || 'Unknown error from Resend API' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Appraisal submitted successfully!', data: responseData });
  } catch (error: any) {
    console.error('Submission Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message || String(error) }, { status: 500 });
  }
}
