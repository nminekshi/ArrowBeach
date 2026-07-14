import { Suspense } from 'react';
import { BookingForm } from '@/components/booking-form';

export const metadata = {
  title: 'Booking',
  description: 'Reserve your stay at Arrow Beach Hotel with check-in, check-out, guest count, room type, and reservation details.',
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
