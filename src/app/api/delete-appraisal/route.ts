import { NextResponse, type NextRequest } from 'next/server';
import db from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Submission ID is required.' }, { status: 400 });
    }

    // 1. Delete from database
    const stmt = db.prepare('DELETE FROM appraisals WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      // It might have already been deleted, but we can still try to delete the folder.
      console.log(`No database entry found for ID: ${id}, attempting to clean up files.`);
    }

    // 2. Delete the associated upload folder
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', id);
    try {
      await fs.rm(uploadDir, { recursive: true, force: true });
    } catch (fsError) {
      // Log the error but don't fail the request if the DB entry was deleted.
      console.error(`Error deleting folder for submission ${id}:`, fsError);
    }
    
    return NextResponse.json({ message: 'Appraisal deleted successfully!' });

  } catch (error: any) {
    console.error('Deletion Error:', error);
    return NextResponse.json(
      {
        message: 'An unexpected error occurred.',
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
