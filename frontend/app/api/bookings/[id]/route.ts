import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    const payload: any = {};
    if (data.customerName !== undefined) payload.fullName = data.customerName;
    if (data.email !== undefined) payload.email = data.email;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.checkIn !== undefined) payload.checkIn = data.checkIn;
    if (data.checkOut !== undefined) payload.checkOut = data.checkOut;
    if (data.guests !== undefined) payload.guests = Number(data.guests);
    if (data.roomType !== undefined) payload.roomType = data.roomType;
    if (data.specialRequests !== undefined) payload.notes = data.specialRequests;
    if (data.status !== undefined) payload.status = data.status.toLowerCase();

    const res = await fetch(`${backendUrl}/api/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }
      const errorMsg = await res.text();
      throw new Error(errorMsg || 'Failed to update reservation');
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
    console.error('Failed to update booking on backend:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    const res = await fetch(`${backendUrl}/api/reservations/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }
      const errorMsg = await res.text();
      throw new Error(errorMsg || 'Failed to delete reservation');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete booking on backend:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete booking' }, { status: 500 });
  }
}
