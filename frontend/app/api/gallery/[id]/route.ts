import { NextRequest, NextResponse } from 'next/server';
import { deleteById, readCollection } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Find the image to get its src/filepath before deleting
  const gallery = readCollection('gallery');
  const image = gallery.find((img: any) => img.id === id);

  const deleted = deleteById('gallery', id);
  if (!deleted) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

  if (image && image.src) {
    try {
      const filePath = path.join(process.cwd(), 'public', image.src);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error('Failed to delete file from disk:', e);
    }
  }

  return NextResponse.json({ success: true });
}
