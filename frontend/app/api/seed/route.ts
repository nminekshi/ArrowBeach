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

    // Initialize bookings collection if missing
    const existingBookings = readCollection('bookings');
    if (!existingBookings) {
      writeCollection('bookings', []);
    }

    // Initialize messages collection if missing
    const existingMessages = readCollection('messages');
    if (!existingMessages) {
      writeCollection('messages', []);
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed' }, { status: 500 });
  }
}
