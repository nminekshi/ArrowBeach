import { NextRequest, NextResponse } from 'next/server';
import { readCollection, insertOne, deleteById } from '@/lib/db';

export async function GET() {
  const messages = readCollection('messages');
  messages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ success: true, messages });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const message = insertOne('messages', { ...data, read: false });
    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
