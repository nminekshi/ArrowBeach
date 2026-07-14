import { NextRequest, NextResponse } from 'next/server';
import { readCollection, insertOne, deleteById } from '@/lib/db';

export async function GET() {
  const gallery = readCollection('gallery');
  return NextResponse.json({ success: true, gallery });
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
