import { NextRequest, NextResponse } from 'next/server';
import { readCollection, insertOne, writeCollection } from '@/lib/db';
import fs from 'fs';
import path from 'path';

function getImagesRecursively(dir: string, baseDir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getImagesRecursively(fullPath, baseDir));
    } else {
      if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
        const relative = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        results.push('/' + relative);
      }
    }
  });
  return results;
}

export async function GET() {
  const gallery = readCollection('gallery');

  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');
  let fsImages: string[] = [];
  try {
    fsImages = getImagesRecursively(imagesDir, publicDir);
  } catch (e) {
    console.error('Error scanning images directory:', e);
  }

  let updated = false;
  const existingSrcs = new Set(gallery.map((img: any) => img.src));

  fsImages.forEach((src) => {
    if (!existingSrcs.has(src)) {
      const filename = src.split('/').pop() || '';
      const alt = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      gallery.push({
        id: `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        src,
        alt,
        createdAt: new Date().toISOString(),
      });
      updated = true;
    }
  });

  if (updated) {
    writeCollection('gallery', gallery);
  }

  return NextResponse.json({ success: true, gallery });
}

export async function PUT(req: NextRequest) {
  try {
    const { order } = await req.json();
    if (!Array.isArray(order)) {
      return NextResponse.json({ success: false, error: 'Invalid order' }, { status: 400 });
    }
    const gallery = readCollection('gallery');
    const idToItem = new Map(gallery.map((img: any) => [img.id, img]));
    const reordered = order.map((id: string) => idToItem.get(id)).filter(Boolean);
    // Append any items not listed in order (safety)
    const orderedIds = new Set(order);
    gallery.forEach((img: any) => {
      if (!orderedIds.has(img.id)) reordered.push(img);
    });
    writeCollection('gallery', reordered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to reorder' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const image = insertOne('gallery', data);
    return NextResponse.json({ success: true, image });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
