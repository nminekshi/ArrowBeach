import { NextRequest, NextResponse } from 'next/server';
import { findById, updateById, deleteById } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = findById('bookings', id);
  if (!booking) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, booking });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const booking = updateById('bookings', id, data);
    if (!booking) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Failed to update booking:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = deleteById('bookings', id);
    if (!deleted) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete booking:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete booking' }, { status: 500 });
  }
}
