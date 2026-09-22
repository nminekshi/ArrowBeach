import { NextRequest, NextResponse } from 'next/server';
import { readCollection, insertOne } from '@/lib/db';
import { sendMessageNotification } from '@/lib/email';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export async function GET() {
  try {
    if (BACKEND_URL) {
      const res = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/api/messages`);
      const data = await res.json();
      return NextResponse.json({ success: true, messages: data.messages || [] });
    }

    const messages = readCollection('messages');
    messages.sort((a, b) => {
      const dateA = new Date((a as { createdAt?: string }).createdAt || 0).getTime();
      const dateB = new Date((b as { createdAt?: string }).createdAt || 0).getTime();
      return dateB - dateA;
    });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (BACKEND_URL) {
      const res = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return NextResponse.json({ success: res.ok, ...result }, { status: res.status });
    }

    const message = insertOne('messages', { ...data, read: false });

    // Send email notification to hotel email (frontend simulation)
    try {
      await sendMessageNotification(message);
    } catch (emailErr) {
      console.error('Non-blocking error sending message notification email:', emailErr);
    }

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
