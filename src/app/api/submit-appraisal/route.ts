import { NextResponse, type NextRequest } from 'next/server';
import { render } from '@react-email/render';
import { AppraisalEmail } from '@/emails/appraisal-email';

export const runtime = 'edge';

// Helper function to convert an ArrayBuffer to a Base64 string in an Edge-compatible way
function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper function to convert a file to a Base64 string
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return arrayBufferToBase64(arrayBuffer);
}

export async function POST(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.APPRAISAL_TO_EMAIL;
  const fromEmail = process.env.APPRAISAL_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    return NextResponse.json(
      {
        message: 'Email configuration is missing. Please contact support.',
      },
      { status: 500 }
    );
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
          fileToBase64(value).then((base64Content) => {
            attachments.push({ filename: value.name, content: base64Content });
            data[key] = value.name; // Keep filename for email template
          })
        );
      } else {
        data[key] = value;
      }
    }

    await Promise.all(filePromises);

    // Render the React Email template to an HTML string
    const html = render(AppraisalEmail({ data }));

    // Manually construct the payload for the Resend API
    const payload = {
      from: `Trade-In Vision <${fromEmail}>`,
      to: [toEmail],
      subject: `New Appraisal Request: ${data.year} ${data.make} ${data.model}`,
      html: html,
      attachments: attachments,
    };
    
    // Use fetch to send the email via Resend's API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API Error:', errorData);
        return NextResponse.json({ message: 'Error sending email.', error: errorData }, { status: 500 });
    }
    
    const responseData = await response.json();

    return NextResponse.json({
      message: 'Appraisal submitted successfully!',
      data: responseData,
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
