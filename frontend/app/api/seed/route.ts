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
      const now = Date.now();
      const sampleMessages = [
        {
          id: `msg-${now}-1`,
          name: 'Emily Richardson',
          email: 'emily.r@gmail.com',
          phone: '+44 7700 900123',
          subject: 'Room Availability',
          message: 'Hello! My husband and I are planning our anniversary trip to Sri Lanka this August. We would love a room with an ocean view for 4 nights, checking in on August 15th. Could you let us know what\'s available and the rates? We\'d also appreciate any information about nearby restaurants. Thank you!',
          read: false,
          createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `msg-${now}-2`,
          name: 'Kamal Fernando',
          email: 'kamal.fernando@outlook.com',
          phone: '+94 71 234 5678',
          subject: 'Airport Transfer',
          message: 'Hi there, we are a group of 4 arriving at Bandaranaike International Airport on July 25th at 3:30 PM (flight UL 504). Could you arrange an airport transfer to your hotel? What is the cost and how long does the drive take? Also, is there a stop we can make at Galle Fort on the way?',
          read: false,
          createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `msg-${now}-3`,
          name: 'Sophie & Pierre Laurent',
          email: 'sophie.laurent@yahoo.fr',
          phone: '+33 6 12 34 56 78',
          subject: 'Reservation Inquiry',
          message: 'Bonjour! We are honeymooners from France looking for your most romantic room package. We will be in Sri Lanka from September 1–7. Do you offer any special honeymoon packages with extras like champagne, flowers, or a candlelit dinner on the beach? Merci beaucoup!',
          read: false,
          createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `msg-${now}-4`,
          name: 'Rajesh Wickramasinghe',
          email: 'rajesh.w@gmail.com',
          phone: '+94 76 987 6543',
          subject: 'Special Requests',
          message: 'I have a confirmed booking for July 28–31 (Booking ref: pending). My wife has a severe nut allergy and is also lactose intolerant. Could your kitchen accommodate these dietary requirements for breakfast? Also, is it possible to get a room on the ground floor as she has difficulty with stairs? Thanks in advance.',
          read: true,
          createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `msg-${now}-5`,
          name: 'Anna Müller',
          email: 'anna.mueller@web.de',
          phone: '+49 170 1234567',
          subject: 'Group Booking',
          message: 'Guten Tag! I am organising a small yoga retreat for 12 people in October (10th–16th). We would need 6 double rooms and access to a quiet outdoor space for morning yoga sessions. Could you provide a group rate? We would also love to arrange a day trip to Mirissa for whale watching. Looking forward to your reply!',
          read: true,
          createdAt: new Date(now - 9 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `msg-${now}-6`,
          name: 'David Chen',
          email: 'david.chen@protonmail.com',
          phone: '',
          subject: 'Feedback',
          message: 'Just wanted to say a massive thank you for the wonderful stay last week (July 3–6). The Deluxe Beach View room was stunning, breakfast was incredible, and the staff went above and beyond — especially Nimal who arranged a surprise birthday cake for my daughter. We will definitely be back and have already recommended you to friends. Keep up the excellent work!',
          read: true,
          createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(),
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
