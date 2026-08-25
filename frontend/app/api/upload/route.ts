import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to avoid overwrites
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const basename = originalName.substring(0, originalName.lastIndexOf('.'));
    const filename = `${basename}-${Date.now()}${extension}`;
    
    // Save to public/images/gallery
    const path = join(process.cwd(), 'public/images/gallery', filename);
    await writeFile(path, buffer);
    
    const url = `/images/gallery/${filename}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload' }, { status: 500 });
  }
}
