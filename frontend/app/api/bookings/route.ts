import { NextRequest, NextResponse } from 'next/server';
import { readCollection, insertOne } from '@/lib/db';
import { sendReservationNotification } from '@/lib/email';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export async function GET() {
  try {
    if (BACKEND_URL) {
      const res = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/api/reservations`);
      const data = await res.json();
      return NextResponse.json({ success: true, bookings: data.reservations || data.bookings || [] });
    }

    const bookings = readCollection('bookings');
    bookings.sort((a, b) => {
      const dateA = new Date((a as { createdAt?: string }).createdAt || 0).getTime();
      const dateB = new Date((b as { createdAt?: string }).createdAt || 0).getTime();
      return dateB - dateA;
    });
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Failed to load bookings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (BACKEND_URL) {
      const res = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return NextResponse.json({ success: res.ok, ...result }, { status: res.status });
    }

    const booking = insertOne('bookings', {
      customerName: data.customerName || data.fullName,
      email: data.email,
      phone: data.phone,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: Number(data.guests) || 1,
      roomType: data.roomType,
      specialRequests: data.specialRequests || data.notes || '',
      status: 'Pending',
    });

    // Send email notification to hotel email
    try {
      await sendReservationNotification(booking);
    } catch (emailErr) {
      console.error('Non-blocking error sending reservation notification email:', emailErr);
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to create booking';
    console.error('Failed to create booking:', errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
