import { Bath, CarFront, ChefHat, Coffee, Home, Waves, Wifi, Wind } from 'lucide-react';

export const site = {
  name: 'Arrow Beach Hotel',
  description:
    'A premium beachfront escape in Sri Lanka with ocean views, elegant rooms, curated hospitality, and a serene setting near Galle.',
  tagline: 'Luxury beachfront stays in Sri Lanka',
  location: 'Galle, Sri Lanka',
  phone: '+94 77 529 0351',
  phoneDisplay: '+94 77 529 0351',
  email: 'arrowbeachresort@gmail.com',
  address: 'Arrow Beach Hotel, Galle, Sri Lanka',
  whatsapp: '94775290351',
  mapQuery: 'Arrow Beach Hotel, Galle, Sri Lanka',
};

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Rooms', href: '/#rooms' },
  { label: 'Facilities', href: '/#facilities' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Book Now', href: '/booking' },
];

export const heroStats = [
  { label: 'Beachfront setting', value: '30 m' },
  { label: 'Galle Town', value: '6 km' },
  { label: 'Signature rooms', value: '3+' },
];

export const highlights = [
  'Private beach access with sunrise views',
  'Refined Sri Lankan hospitality and warm service',
  'Calm interiors designed for romantic and family stays',
];

export const featuredRooms = [
  {
    name: 'Deluxe beach View Double Room',
    type: 'Deluxe beach View Double Room',
    subtitle: 'Inspired by the Deluxe Beach View Double Room',
    price: '$35/night',
    breakfast: '$42/night with breakfast',
    description: 'A polished retreat with a balcony, ocean breeze, and elegant finishes for couples or solo escapes.',
    amenities: ['Balcony', 'Ocean view', 'King bed', 'Ensuite bath'],
    fullAmenities: ['Balcony', 'Ocean view', 'King bed', 'Ensuite bath', 'Air conditioning', 'Free WiFi', 'Mini fridge', 'Tea/Coffee maker', 'Safe'],
    image: '/images/WhatsApp Image 2026-07-05 at 18.01.58.jpeg',
    images: [
      '/images/WhatsApp Image 2026-07-05 at 18.01.58.jpeg',
      '/images/WhatsApp Image 2026-07-05 at 18.41.14.jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.06.34.jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.06.40.jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.06.42.jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.07.00.jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.07.02.jpeg',
      
    ],
  },
  {
    name: 'Deluxe beach View Triple Room',
    type: 'Deluxe beach View Triple Room',
    subtitle: 'Inspired by the Deluxe Beach View Triple Room',
    price: '$50/night',
    breakfast: '+$3/person with breakfast',
    description: 'Spacious and relaxed, with room for the whole family and thoughtful details for longer stays.',
    amenities: ['Large layout', 'Twin beds', 'Extra seating', 'Ocean-facing'],
    fullAmenities: ['Large layout', 'Twin beds', 'Extra seating', 'Ocean-facing', 'Air conditioning', 'Free WiFi', 'Mini fridge', 'Wardrobe', 'Private bathroom'],
    image: '/images/WhatsApp Image 2026-07-05 at 18.02.00.jpeg',
    images: [
      '/images/WhatsApp Image 2026-07-05 at 18.02.00.jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.07.00 (1).jpeg',
      '/images/gallery/WhatsApp Image 2026-07-05 at 18.41.14 (2).jpeg',
      '/images/gallery/WhatsApp Image 2026-07-05 at 18.41.14 (2).jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.07.00.jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.06.35.jpeg',



    ],
   
  },
  {
    name: 'Standard AC Room',
    type: 'Standart AC Room',
    subtitle: 'Inspired by the premium brochure collection',
    price: '$28/night',
    breakfast: '$35/night with breakfast',
    description: 'A bright, airy stay with calming sea tones and a clear view of the shoreline horizon.',
    amenities: ['Air conditioning', 'Work desk', 'Sunlit interiors'],
    fullAmenities: ['Air conditioning', 'Work desk', 'Sunlit interiors', 'Free WiFi', 'Ensuite bath', 'Comfortable bedding', 'Wardrobe'],
    image: '/images/WhatsApp Image 2026-07-05 at 18.01.54.jpeg',
    images: [
      '/images/WhatsApp Image 2026-07-05 at 18.01.54.jpeg',
      '/images/WhatsApp Image 2026-07-05 at 18.41.14 (1).jpeg',
      '/images/WhatsApp Image 2025-11-13 at 14.06.42.jpeg',
      
    ],
   
  },
];

export const rateGuide = [
  {
    name: 'Deluxe Beach View Double Room',
    note: 'With balcony • Ocean views',
    normalRate: '$35',
    breakfastRate: '$42',
  },
  {
    name: 'Deluxe Beach View Triple Room',
    note: 'With balcony • Ocean views',
    normalRate: '$50',
    breakfastRate: '+$3/person',
  },
  {
    name: 'Deluxe Triple Room',
    note: 'Ground floor',
    normalRate: '$50',
    breakfastRate: '+$3/person',
  },
  {
    name: 'Standard Double Room with AC',
    note: 'Air conditioned',
    normalRate: '$28',
    breakfastRate: '$35',
  },
  {
    name: 'Standard Double Room Non-AC',
    note: 'Budget friendly option',
    normalRate: '$18',
    breakfastRate: '$25',
  },
];

export const facilities = [
  { label: 'Beach Access', Icon: Waves },
  { label: 'Free WiFi', Icon: Wifi },
  { label: 'Swimming Pool', Icon: Bath },
  { label: 'Restaurant', Icon: ChefHat },
  { label: 'Parking', Icon: CarFront },
  { label: 'Air Conditioning', Icon: Wind },
  { label: 'Room Service', Icon: Coffee },
  { label: 'Comfort Suites', Icon: Home },
];

export const galleryImages = [
  {
    alt: 'Arrow Beach Hotel room with sea view curtains',
    src: '/images/gallery/gallery-1.jpg',
  },
  {
    alt: 'Arrow Beach Hotel chair and table near the balcony',
    src: '/images/gallery/gallery-2.jpg',
  },
  {
    alt: 'Arrow Beach Hotel bedroom interior',
    src: '/images/gallery/gallery-3.jpg',
  },
  {
    alt: 'Arrow Beach Hotel pool at sunset',
    src: '/images/gallery/gallery-4.jpg',
  },
  {
    alt: 'Arrow Beach Hotel terrace with sea view',
    src: '/images/gallery/gallery-5.jpg',
  },
  {
    alt: 'Arrow Beach Hotel open-air seating area',
    src: '/images/gallery/gallery-6.jpg',
  },
];

export const testimonials = [
  {
    name: 'Anjali Perera',
    role: 'Colombo, Sri Lanka',
    quote: 'The ocean views, quiet atmosphere, and thoughtful service made this feel far more premium than the price suggests.',
  },
  {
    name: 'Marcus de Silva',
    role: 'Family traveler',
    quote: 'The room was spotless and spacious, and the team handled every request with calm, professional care.',
  },
  {
    name: 'Sophie L.',
    role: 'Weekend guest',
    quote: 'Sunrise coffee on the balcony was the highlight. Everything about the property feels curated and serene.',
  },
];

export const attractions = [
  {
    name: 'Galle Fort',
    distance: '12 min drive',
    description: 'Historic coastal charm, boutique cafes, and sunset ramparts.',
  },
  {
    name: 'Unawatuna Beach',
    distance: '18 min drive',
    description: 'Soft sand, calm water, and relaxed beach bars for the evening.',
  },
  {
    name: 'Japanese Peace Pagoda',
    distance: '22 min drive',
    description: 'A peaceful viewpoint for panoramic Indian Ocean scenery.',
  },
  {
    name: 'Sea Turtle Hatchery',
    distance: '25 min drive',
    description: 'A family-friendly conservation stop along the southern coast.',
  },
];

export const bookingDefaults = {
  roomTypes: [
    'Deluxe Beach View Double Room',
    'Deluxe Beach View Triple Room',
    'Deluxe Triple Room',
    'Standard Double Room with AC',
    'Standard Double Room Non-AC',
  ],
};
