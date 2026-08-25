import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BookingForm } from '@/components/booking-form';

export const metadata: Metadata = {
  title: 'Book Your Stay | Arrow Beach Hotel - Beachfront Hotel in Galle',
  description:
    'Reserve your stay at Arrow Beach Hotel, a premier beachfront hotel in Galle near Pitiwella Beach, Sri Lanka. Select check-in dates, guest count, and ocean view rooms.',
  keywords: [
    'Arrow Beach Hotel booking',
    'beachfront hotel in Galle',
    'hotel near Pitiwella Beach',
    'book hotel in Galle',
    'Sri Lanka beach resort booking',
  ],
  alternates: {
    canonical: '/booking',
  },
  openGraph: {
    title: 'Book Your Stay | Arrow Beach Hotel - Beachfront Hotel in Galle',
    description:
      'Reserve your luxury room at Arrow Beach Hotel near Pitiwella Beach, Galle. Ocean view balconies and serene beachfront stays.',
    url: '/booking',
  },
};

export default function BookingPage() {
  return (
    <main className="bg-section-gradient pt-28">
      <Suspense fallback={<div className="w-full px-6 py-24 text-slate-600 lg:px-8">Loading booking form...</div>}>
        <BookingForm />
      </Suspense>
    </main>
  );
}
