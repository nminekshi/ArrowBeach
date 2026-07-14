'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { bookingDefaults, site } from '@/data/site';

const initialState = {
  checkIn: '',
  checkOut: '',
  guests: '2',
  roomType: bookingDefaults.roomTypes[0],
  fullName: '',
  email: '',
  phone: '',
  notes: '',
};

type BookingState = typeof initialState;

export function BookingForm() {
  const searchParams = useSearchParams();
  const initialRoomType = searchParams.get('room');
  const [form, setForm] = useState<BookingState>({
    ...initialState,
    roomType: initialRoomType && bookingDefaults.roomTypes.includes(initialRoomType) ? initialRoomType : initialState.roomType,
  });
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  const whatsappMessage = useMemo(() => {
    const lines = [
      `Hello Arrow Beach Hotel, I'd like to reserve a ${form.roomType}.`,
      `Check-in: ${form.checkIn || 'TBD'}`,
      `Check-out: ${form.checkOut || 'TBD'}`,
      `Guests: ${form.guests}`,
      form.fullName ? `Name: ${form.fullName}` : '',
      form.phone ? `Phone: ${form.phone}` : '',
      form.notes ? `Notes: ${form.notes}` : '',
    ].filter(Boolean);

    return encodeURIComponent(lines.join('\n'));
  }, [form]);

  const updateField = (field: keyof BookingState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState('loading');
    setFeedback('');

    try {
      const response = await fetch(`${backendUrl}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          guests: Number(form.guests),
        }),
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result === 'object' && result !== null && 'message' in result
            ? String((result as { message?: string }).message)
            : 'Failed to save reservation',
        );
      }

      setSubmitState('success');
      setFeedback('Reservation request saved successfully.');
    } catch (error) {
      setSubmitState('error');
      setFeedback(error instanceof Error ? error.message : 'Unable to submit reservation');
    }
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="grid w-full gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ocean-700/65">Booking</p>
          <h1 className="mt-4 font-display text-5xl text-night sm:text-6xl">Reserve your beach escape.</h1>
          <p className="mt-6 text-lg leading-8 text-night/70">
            Share your dates and preferences. We’ll use the details to prepare a smooth reservation experience and can continue on WhatsApp if you prefer.
          </p>

          <div className="mt-10 rounded-[2rem] border border-sand-200 bg-white p-6 shadow-luxury">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ocean-700/65">Quick actions</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={`https://wa.me/${site.whatsapp}?text=${whatsappMessage}`}
                className="inline-flex items-center justify-center rounded-full bg-ocean-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-ocean-800"
              >
                Continue on WhatsApp
              </a>
              <a
                href="mailto:arrowbeachresort@gmail.com?subject=Booking%20Request"
                className="inline-flex items-center justify-center rounded-full border border-sand-200 px-5 py-4 text-sm font-semibold text-night transition hover:bg-sand-50"
              >
                Email Reservation
              </a>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          onSubmit={onSubmit}
          className="rounded-[2rem] border border-sand-200 bg-white p-6 shadow-luxury sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-night/80">
              Check-in
              <div className="flex items-center gap-3 rounded-2xl border border-sand-200 px-4 py-3">
                <CalendarDays size={18} className="text-ocean-800" />
                <input type="date" value={form.checkIn} onChange={(event) => updateField('checkIn', event.target.value)} className="w-full bg-transparent outline-none" />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-medium text-night/80">
              Check-out
              <div className="flex items-center gap-3 rounded-2xl border border-sand-200 px-4 py-3">
                <CalendarDays size={18} className="text-ocean-800" />
                <input type="date" value={form.checkOut} onChange={(event) => updateField('checkOut', event.target.value)} className="w-full bg-transparent outline-none" />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-medium text-night/80">
              Guests
              <div className="flex items-center gap-3 rounded-2xl border border-sand-200 px-4 py-3">
                <Users size={18} className="text-ocean-800" />
                <select value={form.guests} onChange={(event) => updateField('guests', event.target.value)} className="w-full bg-transparent outline-none">
                  {['1', '2', '3', '4', '5', '6'].map((guestCount) => (
                    <option key={guestCount} value={guestCount}>
                      {guestCount}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="grid gap-2 text-sm font-medium text-night/80">
              Room Type
              <select value={form.roomType} onChange={(event) => updateField('roomType', event.target.value)} className="rounded-2xl border border-sand-200 px-4 py-3 outline-none">
                {bookingDefaults.roomTypes.map((roomType) => (
                  <option key={roomType} value={roomType}>
                    {roomType}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-night/80 sm:col-span-2">
              Full Name
              <input value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} className="rounded-2xl border border-sand-200 px-4 py-3 outline-none" placeholder="Your full name" />
            </label>

            <label className="grid gap-2 text-sm font-medium text-night/80">
              Email
              <input value={form.email} onChange={(event) => updateField('email', event.target.value)} className="rounded-2xl border border-sand-200 px-4 py-3 outline-none" placeholder="you@example.com" type="email" />
            </label>

            <label className="grid gap-2 text-sm font-medium text-night/80">
              Phone
              <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="rounded-2xl border border-sand-200 px-4 py-3 outline-none" placeholder="+94 ..." />
            </label>

            <label className="grid gap-2 text-sm font-medium text-night/80 sm:col-span-2">
              Special Requests
              <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows={4} className="rounded-2xl border border-sand-200 px-4 py-3 outline-none" placeholder="Airport transfer, late arrival, anniversary setup..." />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitState === 'loading'}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-sand-200 px-5 py-4 text-sm font-semibold text-night transition hover:bg-sand-100"
          >
            {submitState === 'loading' ? 'Submitting...' : 'Request Reservation'}
            <ArrowRight className="ml-2" size={18} />
          </button>

          {submitState === 'success' ? (
            <p className="mt-4 rounded-2xl bg-ocean-50 px-4 py-3 text-sm text-ocean-900">
              {feedback}
            </p>
          ) : null}

          {submitState === 'error' ? (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {feedback}
            </p>
          ) : null}
        </motion.form>
      </div>
    </section>
  );
}
