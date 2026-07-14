import { NextRequest, NextResponse } from 'next/server';
import { readCollection, updateById } from '@/lib/db';

export async function GET() {
  const settings = readCollection('settings');
  const main = settings.find((s: any) => s.id === 'main') || null;
  return NextResponse.json({ success: true, settings: main });
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const updated = updateById('settings', 'main', data);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
