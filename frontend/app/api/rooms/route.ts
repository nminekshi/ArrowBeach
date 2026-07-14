import { NextRequest, NextResponse } from 'next/server';
import { readCollection, insertOne, deleteById } from '@/lib/db';

export async function GET() {
  const rooms = readCollection('rooms');
  return NextResponse.json({ success: true, rooms });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const room = insertOne('rooms', data);
    return NextResponse.json({ success: true, room });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create room' }, { status: 500 });
  }
}
