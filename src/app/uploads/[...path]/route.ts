import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import mime from 'mime';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = path.join(process.cwd(), 'uploads', ...params.path);

  try {
    const file = await fs.readFile(filePath);
    const contentType = mime.getType(filePath) || 'application/octet-stream';

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': file.length.toString(),
      },
    });
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return new NextResponse('File not found', { status: 404 });
  }
}
