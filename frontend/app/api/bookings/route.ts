import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const res = await fetch(`${backendUrl}/api/reservations`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch from backend');
    }
    const data = await res.json();
    const backendReservations = data.reservations || [];
    
    // Map backend database format to frontend schema
    const bookings = backendReservations.map((item: any) => ({
      id: item._id,
      customerName: item.fullName,
      email: item.email,
      phone: item.phone,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      guests: item.guests,
      roomType: item.roomType,
      specialRequests: item.notes || '',
      status: item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : 'Pending',
      createdAt: item.createdAt,
    }));

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Failed to load bookings from backend:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    
    const payload = {
      fullName: data.customerName,
      email: data.email,
      phone: data.phone,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: Number(data.guests),
      roomType: data.roomType,
      notes: data.specialRequests || '',
    };

    const res = await fetch(`${backendUrl}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg || 'Failed to save on backend');
    }

    const responseData = await res.json();
    const item = responseData.reservation;
    
    const booking = {
      id: item._id,
      customerName: item.fullName,
      email: item.email,
      phone: item.phone,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      guests: item.guests,
      roomType: item.roomType,
      specialRequests: item.notes || '',
      status: item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : 'Pending',
      createdAt: item.createdAt,
    };

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Failed to create booking on backend:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
