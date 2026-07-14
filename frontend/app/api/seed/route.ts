import { NextResponse } from 'next/server';
import { readCollection, writeCollection } from '@/lib/db';
import { featuredRooms, site, galleryImages } from '@/data/site';

// GET /api/seed — Seeds the JSON database with existing site data
export async function GET() {
  try {
    // Seed rooms if empty
    const existingRooms = readCollection('rooms');
    if (existingRooms.length === 0) {
      const rooms = featuredRooms.map((room, i) => ({
        id: `room-${Date.now()}-${i}`,
        name: room.name,
        type: room.type,
        subtitle: room.subtitle,
        price: room.price,
        breakfast: room.breakfast,
        description: room.description,
        amenities: room.amenities,
        fullAmenities: room.fullAmenities,
        image: room.image,
        images: room.images,
        createdAt: new Date().toISOString(),
      }));
      writeCollection('rooms', rooms);
    }

    // Seed settings if empty
    const existingSettings = readCollection('settings');
    if (existingSettings.length === 0) {
      const settings = [{
        id: 'main',
        name: site.name,
        description: site.description,
        tagline: site.tagline,
        location: site.location,
        phone: site.phone,
        phoneDisplay: site.phoneDisplay,
        email: site.email,
        address: site.address,
        whatsapp: site.whatsapp,
        mapQuery: site.mapQuery,
        createdAt: new Date().toISOString(),
      }];
      writeCollection('settings', settings);
    }

    // Seed gallery if empty
    const existingGallery = readCollection('gallery');
    if (existingGallery.length === 0) {
      const gallery = galleryImages.map((img, i) => ({
        id: `gallery-${Date.now()}-${i}`,
        src: img.src,
        alt: img.alt,
        createdAt: new Date().toISOString(),
      }));
      writeCollection('gallery', gallery);
    }

    // Seed sample bookings if empty
    const existingBookings = readCollection('bookings');
    if (existingBookings.length === 0) {
      const sampleBookings = [
        {
          id: `booking-${Date.now()}-1`,
          customerName: 'Anjali Perera',
          email: 'anjali@example.com',
          phone: '+94 77 123 4567',
          checkIn: '2026-07-10',
          checkOut: '2026-07-13',
          guests: 2,
          roomType: 'Deluxe beach View Double Room',
          specialRequests: 'Late check-in around 10pm',
          status: 'Pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: `booking-${Date.now()}-2`,
          customerName: 'Marcus de Silva',
          email: 'marcus@example.com',
          phone: '+94 76 987 6543',
          checkIn: '2026-07-15',
          checkOut: '2026-07-18',
          guests: 3,
          roomType: 'Deluxe beach View Triple Room',
          specialRequests: 'Extra pillows please',
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
        },
        {
          id: `booking-${Date.now()}-3`,
          customerName: 'Sophie Laurent',
          email: 'sophie.l@example.com',
          phone: '+33 6 12 34 56 78',
          checkIn: '2026-07-20',
          checkOut: '2026-07-22',
          guests: 1,
          roomType: 'Standard AC Room',
          specialRequests: '',
          status: 'Pending',
          createdAt: new Date().toISOString(),
        },
      ];
      writeCollection('bookings', sampleBookings);
    }

    // Seed sample messages if empty
    const existingMessages = readCollection('messages');
    if (existingMessages.length === 0) {
      const sampleMessages = [
        {
          id: `msg-${Date.now()}-1`,
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+44 7911 123456',
          subject: 'Room availability in August',
          message: 'Hi, I am planning a trip to Galle in August and wondering if you have any rooms available for 5 nights from August 10th? We are a family of 4.',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: `msg-${Date.now()}-2`,
          name: 'Kamal Fernando',
          email: 'kamal.f@example.com',
          phone: '+94 71 234 5678',
          subject: 'Airport transfer',
          message: 'Do you offer airport transfer services from Bandaranaike International Airport? If so, what would be the cost?',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ];
      writeCollection('messages', sampleMessages);
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed' }, { status: 500 });
  }
}
