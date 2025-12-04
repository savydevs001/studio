import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { AppraisalEmail } from '@/emails/appraisal-email';
import bufferFrom from 'buffer-from';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.APPRAISAL_TO_EMAIL;
const fromEmail = process.env.APPRAISAL_FROM_EMAIL;

export async function POST(request: NextRequest) {
  if (!toEmail || !fromEmail) {
    return NextResponse.json({ 
        message: 'Email configuration is missing. Please contact support.' 
    }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const data: { [key: string]: string | File } = {};
    const attachments: { filename: string; content: Buffer }[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = bufferFrom(await value.arrayBuffer());
        attachments.push({ filename: value.name, content: buffer });
        // We will pass the filename to the email template so it knows a file was uploaded
        data[key] = value.name;
      } else {
        data[key] = value;
      }
    }

    const { data: emailData, error } = await resend.emails.send({
      from: `Trade-In Vision <${fromEmail}>`,
      to: [toEmail],
      subject: `New Appraisal Request: ${data.year} ${data.make} ${data.model}`,
      react: <AppraisalEmail data={data} />,
      attachments: attachments,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ message: 'Error sending email.', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Appraisal submitted successfully!', data: emailData });
  } catch (error: any) {
    console.error('Submission Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}
