import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Log that we received the data to confirm the endpoint is working.
    // In a real application, you would now process this data (e.g., save to a database).
    console.log('Appraisal data received successfully. Processing is now complete.');

    // You can iterate through the form data to see what was received
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value instanceof File ? value.name : value}`);
    // }

    // Return a success response to the client.
    return NextResponse.json({
      message: 'Appraisal submitted successfully!',
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
