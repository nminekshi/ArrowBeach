'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  Download,
  Home,
  Mail,
  MessageSquareMore,
  MoonStar,
  Plane,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Ticket,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ComponentType, type FormEvent, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

type Reservation = {
  id: string;
  fullName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  notes?: string;
  status: ReservationStatus;
  createdAt?: string;
};

type ServiceRequest = {
  id: string;
  title: string;
  detail: string;
  eta: string;
  status: 'Open' | 'In progress' | 'Done';
};

type PreferenceState = {
  roomMood: 'Calm' | 'Ocean' | 'Family';
  breakfastTime: string;
  transport: boolean;
  housekeeping: boolean;
  anniversary: boolean;
};

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  accent: 'emerald' | 'sky' | 'amber';
};

type StoredDashboardState = {
  selectedReservationId?: string;
  preferences?: PreferenceState;
  requests?: ServiceRequest[];
  activity?: ActivityItem[];
};

const storageKey = 'arrow-beach-guest-dashboard-v1';

const roomRates: Record<string, number> = {
  'Deluxe Room': 10500,
  'Family Room': 15000,
  'Ocean View Room': 8500,
};

const fallbackReservations: Reservation[] = [
  {
    id: 'res-001',
    fullName: 'Anjali Perera',
    email: 'anjali@example.com',
    checkIn: '2026-07-08',
    checkOut: '2026-07-11',
    guests: 2,
    roomType: 'Ocean View Room',
    notes: 'Anniversary setup and late arrival around 8 PM.',
    status: 'confirmed',
    createdAt: '2026-06-28T10:15:00.000Z',
  },
  {
    id: 'res-002',
    fullName: 'Marcus Silva',
    email: 'marcus@example.com',
    checkIn: '2026-08-02',
    checkOut: '2026-08-05',
    guests: 4,
    roomType: 'Family Room',
    notes: 'Need airport pickup and child breakfast options.',
    status: 'pending',
    createdAt: '2026-06-30T14:40:00.000Z',
  },
];

const defaultPreferences: PreferenceState = {
  roomMood: 'Ocean',
  breakfastTime: '08:00',
  transport: true,
  housekeeping: true,
  anniversary: false,
};

const defaultRequests: ServiceRequest[] = [
  { id: 'request-1', title: 'Airport pickup', detail: 'SUV for 4 guests on arrival day', eta: 'Today, 6:00 PM', status: 'Open' },
  { id: 'request-2', title: 'Late checkout', detail: 'Request 1:00 PM checkout for suite stay', eta: 'Awaiting review', status: 'In progress' },
];

const defaultActivity: ActivityItem[] = [
  { id: 'activity-1', title: 'Reservation confirmed', detail: 'Your ocean view stay is locked for 8 Jul.', accent: 'emerald' },
  { id: 'activity-2', title: 'Concierge note saved', detail: 'Arrival time and pickup preference are ready.', accent: 'sky' },
];

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString('en-LK')}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date);
}

function formatLongDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 1;
  }

  const millis = end.getTime() - start.getTime();
  return Math.max(1, Math.round(millis / (1000 * 60 * 60 * 24)));
}

function getTone(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes('confirmed') || normalized.includes('done') || normalized.includes('open')) {
    return 'emerald';
  }

  if (normalized.includes('pending') || normalized.includes('progress')) {
    return 'amber';
  }

  if (normalized.includes('cancelled')) {
    return 'rose';
  }

  return 'sky';
}

function TonePill({ label }: { label: string }) {
  const tone = getTone(label);
  const styles: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  };

  return <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset', styles[tone])}>{label}</span>;
}

function SectionCard({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_65px_rgba(31,41,55,0.08)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-700/70">{eyebrow}</p> : null}
          <h2 className="mt-2 font-display text-2xl text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MetricCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/82 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.15)]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function accentStyles(accent: ActivityItem['accent']) {
  if (accent === 'emerald') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (accent === 'amber') return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-sky-200 bg-sky-50 text-sky-800';
}

export function GuestDashboardShell() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>(fallbackReservations);
  const [selectedReservationId, setSelectedReservationId] = useState(fallbackReservations[0].id);
  const [preferences, setPreferences] = useState<PreferenceState>(defaultPreferences);
  const [requests, setRequests] = useState<ServiceRequest[]>(defaultRequests);
  const [activity, setActivity] = useState<ActivityItem[]>(defaultActivity);
  const [conciergeNote, setConciergeNote] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const storedValue = window.localStorage.getItem(storageKey);

    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue) as StoredDashboardState;

        if (parsed.preferences) setPreferences(parsed.preferences);
        if (parsed.requests?.length) setRequests(parsed.requests);
        if (parsed.activity?.length) setActivity(parsed.activity);
        if (parsed.selectedReservationId) setSelectedReservationId(parsed.selectedReservationId);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        selectedReservationId,
        preferences,
        requests,
        activity,
      }),
    );
  }, [activity, isReady, preferences, requests, selectedReservationId]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReservations() {
      setIsLoading(true);

      try {
        const response = await fetch(`${backendUrl}/api/reservations`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Unable to load reservations');
        }

        const payload: unknown = await response.json();

        const liveReservations =
          typeof payload === 'object' && payload !== null && 'reservations' in payload && Array.isArray((payload as { reservations?: unknown[] }).reservations)
            ? ((payload as { reservations: Reservation[] }).reservations ?? [])
            : [];

        setReservations(liveReservations.length > 0 ? liveReservations : fallbackReservations);
      } catch {
        setReservations(fallbackReservations);
        setStatusMessage('Showing offline dashboard data. Live reservations will appear once the backend is available.');
      } finally {
        setIsLoading(false);
      }
    }

    loadReservations();

    return () => controller.abort();
  }, [backendUrl]);

  useEffect(() => {
    if (reservations.length === 0) {
      return;
    }

    const hasSelected = reservations.some((reservation) => reservation.id === selectedReservationId);
    if (!hasSelected) {
      setSelectedReservationId(reservations[0].id);
    }
  }, [reservations, selectedReservationId]);

  const activeReservation = reservations.find((reservation) => reservation.id === selectedReservationId) ?? reservations[0];

  const upcomingReservation = useMemo(() => {
    const ordered = [...reservations].sort((left, right) => new Date(left.checkIn).getTime() - new Date(right.checkIn).getTime());

    return ordered.find((reservation) => reservation.status !== 'cancelled') ?? ordered[0];
  }, [reservations]);

  const activeRate = activeReservation ? roomRates[activeReservation.roomType] ?? 9200 : 9200;
  const activeNights = activeReservation ? nightsBetween(activeReservation.checkIn, activeReservation.checkOut) : 1;
  const estimatedStayTotal = activeRate * activeNights;

  const metrics = useMemo(() => {
    const upcomingCount = reservations.filter((reservation) => reservation.status !== 'cancelled').length;
    const openRequests = requests.filter((request) => request.status !== 'Done').length;
    const totalNights = reservations.reduce((sum, reservation) => sum + nightsBetween(reservation.checkIn, reservation.checkOut), 0);
    const preferredRoom = activeReservation?.roomType ?? 'No room selected';

    return [
      {
        label: 'Upcoming stays',
        value: String(upcomingCount),
        detail: 'Reservations ready to review or confirm.',
        icon: CalendarDays,
      },
      {
        label: 'Open requests',
        value: String(openRequests),
        detail: 'Airport pickup, checkout, and concierge tasks.',
        icon: BellRing,
      },
      {
        label: 'Planned nights',
        value: String(totalNights),
        detail: 'Total nights across the current travel list.',
        icon: MoonStar,
      },
      {
        label: 'Preferred room',
        value: preferredRoom,
        detail: 'Your active reservation or saved room type.',
        icon: Home,
      },
    ];
  }, [activeReservation?.roomType, requests, reservations]);

  const addRequest = (title: string, detail: string, eta: string) => {
    const nextRequest: ServiceRequest = {
      id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      title,
      detail,
      eta,
      status: 'Open',
    };

    setRequests((current) => [nextRequest, ...current].slice(0, 6));
    setActivity((current) => [
      {
        id: `activity-${Date.now()}`,
        title: `${title} requested`,
        detail,
        accent: 'sky' as const,
      },
      ...current,
    ].slice(0, 5));
    setStatusMessage(`${title} added to your concierge queue.`);
  };

  const updateRequestStatus = (requestId: string) => {
    setRequests((current) => current.map((request) => (request.id === requestId ? { ...request, status: request.status === 'Done' ? 'Open' : 'Done' } : request)));
  };

  const saveNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const note = conciergeNote.trim();
    if (!note) {
      setStatusMessage('Add a note before sending it to the concierge queue.');
      return;
    }

    addRequest('Concierge note', note, 'Within 30 minutes');
    setConciergeNote('');
  };

  const setRoomMood = (roomMood: PreferenceState['roomMood']) => {
    setPreferences((current) => ({ ...current, roomMood }));
    setActivity((current) => [
      {
        id: `activity-${Date.now()}`,
        title: 'Preference updated',
        detail: `Room mood changed to ${roomMood.toLowerCase()}.`,
        accent: 'emerald' as const,
      },
      ...current,
    ].slice(0, 5));
  };

  const setBreakfastTime = (breakfastTime: string) => {
    setPreferences((current) => ({ ...current, breakfastTime }));
  };

  const togglePreferenceFlag = (key: 'transport' | 'housekeeping' | 'anniversary') => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  const downloadItinerary = () => {
    if (typeof window === 'undefined' || !activeReservation) {
      return;
    }

    const payload = {
      reservation: activeReservation,
      preferences,
      requests,
      activity,
    };

    const file = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'arrow-beach-itinerary.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Itinerary download started.');
  };

  const tripProgress = Math.min(100, 20 + activeNights * 22);

  return (
    <main className="relative overflow-hidden pb-16 pt-24 sm:pt-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.16),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#f7f2e8_42%,#ede3d1_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.08),transparent)]" />

      <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 lg:space-y-7">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid items-start gap-6 rounded-[2.5rem] border border-white/80 bg-white/74 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr] lg:p-8"
        >
          <div className="space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-sky-800">
                <Ticket className="h-3.5 w-3.5" />
                Guest dashboard
              </div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl">
                Your stay, your itinerary, your concierge.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                A premium travel workspace for reservations, service requests, and stay preferences. The dashboard stays connected to the backend when available and falls back to sample data when it is not.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Trip state</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{activeReservation ? 'Ready to travel' : 'Plan a stay'}</p>
                <p className="mt-1 text-sm text-slate-600">One view for everything important.</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Live sync</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{isLoading ? 'Refreshing' : 'Connected'}</p>
                <p className="mt-1 text-sm text-slate-600">Reservation data and requests.</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Next stay</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{upcomingReservation ? formatDate(upcomingReservation.checkIn) : 'N/A'}</p>
                <p className="mt-1 text-sm text-slate-600">{upcomingReservation ? upcomingReservation.roomType : 'No trip planned'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/booking" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Book a new stay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button type="button" onClick={downloadItinerary} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Download itinerary
              </button>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                <ShieldCheck className="h-4 w-4" />
                Private workspace
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-sky-200/70 bg-gradient-to-br from-sky-50 to-white p-5 shadow-[0_18px_40px_rgba(14,165,233,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700/70">Next arrival</p>
              <p className="mt-3 font-display text-3xl text-slate-950">{upcomingReservation ? formatDate(upcomingReservation.checkIn) : 'No trip yet'}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{upcomingReservation ? `${upcomingReservation.roomType} for ${upcomingReservation.guests} guest${upcomingReservation.guests > 1 ? 's' : ''}.` : 'Start a booking to populate your dashboard.'}</p>
              <div className="mt-5 h-2 rounded-full bg-sky-100">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" style={{ width: `${tripProgress}%` }} />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Current total</p>
              <p className="mt-3 font-display text-3xl text-slate-950">{formatCurrency(estimatedStayTotal)}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Estimated stay value for the selected reservation.</p>
            </div>

            <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Status</p>
              <div className="mt-3 flex items-center gap-2">
                <TonePill label={activeReservation?.status ?? 'ready'} />
                <span className="text-sm text-slate-600">{isLoading ? 'Syncing reservations...' : 'Synced with booking records'}</span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Last update</p>
              <p className="mt-3 font-display text-3xl text-slate-950">{activeReservation?.createdAt ? formatLongDate(activeReservation.createdAt) : 'Today'}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Latest reservation activity or dashboard save.</p>
            </div>
          </div>
        </motion.section>

        {statusMessage ? (
          <div className="rounded-[1.5rem] border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 shadow-sm">
            {statusMessage}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label={metrics[0].label} value={metrics[0].value} detail={metrics[0].detail} icon={metrics[0].icon} />
          <MetricCard label={metrics[1].label} value={metrics[1].value} detail={metrics[1].detail} icon={metrics[1].icon} />
          <MetricCard label={metrics[2].label} value={metrics[2].value} detail={metrics[2].detail} icon={metrics[2].icon} />
          <MetricCard label={metrics[3].label} value={metrics[3].value} detail={metrics[3].detail} icon={metrics[3].icon} />
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <SectionCard eyebrow="Reservations" title="Trip timeline" action={<TonePill label={`${reservations.length} records`} />}>
              <div className="space-y-3">
                {reservations.map((reservation) => {
                  const isSelected = reservation.id === selectedReservationId;
                  const nights = nightsBetween(reservation.checkIn, reservation.checkOut);
                  const estimatedTotal = (roomRates[reservation.roomType] ?? activeRate) * nights;

                  return (
                    <button
                      key={reservation.id}
                      type="button"
                      onClick={() => setSelectedReservationId(reservation.id)}
                      className={cn(
                        'w-full rounded-[1.5rem] border p-4 text-left transition',
                        isSelected ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className={cn('text-base font-semibold', isSelected ? 'text-white' : 'text-slate-950')}>{reservation.roomType}</p>
                            <TonePill label={reservation.status} />
                          </div>
                          <p className={cn('mt-1 text-sm', isSelected ? 'text-white/75' : 'text-slate-500')}>{reservation.fullName} · {reservation.email}</p>
                          <p className={cn('mt-1 text-sm', isSelected ? 'text-white/75' : 'text-slate-500')}>
                            {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)} · {nights} night{nights > 1 ? 's' : ''} · {reservation.guests} guest{reservation.guests > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className={cn('rounded-2xl px-3 py-2 text-sm font-semibold', isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800')}>
                          {formatCurrency(estimatedTotal)}
                        </div>
                      </div>
                      {reservation.notes ? (
                        <p className={cn('mt-4 rounded-2xl px-4 py-3 text-sm leading-6', isSelected ? 'bg-white/10 text-white/80' : 'bg-slate-50 text-slate-600')}>
                          {reservation.notes}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard eyebrow="Activity" title="Recent concierge updates" action={<TonePill label={`${activity.length} saved`} />}>
              <div className="grid gap-3 sm:grid-cols-2">
                {activity.map((item) => (
                  <article key={item.id} className={cn('rounded-[1.25rem] border p-4', accentStyles(item.accent))}>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 opacity-85">{item.detail}</p>
                  </article>
                ))}
              </div>
            </SectionCard>

            <SectionCard eyebrow="Summary" title="What your stay includes" action={<TonePill label="At a glance" />}>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: BedIcon, title: 'Quiet room', detail: 'Comfortable layout and curated view.' },
                  { icon: Mail, title: 'Fast support', detail: 'Email or concierge for quick replies.' },
                  { icon: BellRing, title: 'Daily assistance', detail: 'Keep requests in one queue.' },
                  { icon: Sparkles, title: 'Flexible preferences', detail: 'Save room mood and service choices.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-950">
                      <item.icon className="h-4 w-4" />
                      <p className="text-sm font-semibold">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard eyebrow="Stay summary" title="Active reservation" action={activeReservation ? <TonePill label={`${activeNights} nights`} /> : undefined}>
              {activeReservation ? (
                <div className="space-y-4">
                  <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-[0_24px_55px_rgba(15,23,42,0.18)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">{activeReservation.roomType}</p>
                    <p className="mt-3 font-display text-3xl">{formatCurrency(estimatedStayTotal)}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{formatDate(activeReservation.checkIn)} - {formatDate(activeReservation.checkOut)} · {activeReservation.guests} guest{activeReservation.guests > 1 ? 's' : ''}</p>
                    <div className="mt-5 h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300" style={{ width: `${Math.min(100, 30 + activeNights * 20)}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Check-in</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(activeReservation.checkIn)}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Check-out</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(activeReservation.checkOut)}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Guests</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{activeReservation.guests}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Room</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{activeReservation.roomType}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-7 text-slate-600">No reservation is selected yet. Use the booking page to create one, then refresh your dashboard.</p>
              )}
            </SectionCard>

            <SectionCard eyebrow="Profile" title="Your stay settings" action={<TonePill label="Saved locally" />}>
              <div className="grid gap-3 sm:grid-cols-3">
                {(['Calm', 'Ocean', 'Family'] as const).map((roomMood) => (
                  <button
                    key={roomMood}
                    type="button"
                    onClick={() => setRoomMood(roomMood)}
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition',
                      preferences.roomMood === roomMood ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                    )}
                  >
                    {roomMood}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3">
                <label className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mb-2 block font-semibold text-slate-950">Breakfast time</span>
                  <input
                    type="time"
                    value={preferences.breakfastTime}
                    onChange={(event) => setBreakfastTime(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { key: 'transport', label: 'Airport transport', icon: Plane },
                    { key: 'housekeeping', label: 'Daily housekeeping', icon: Sparkles },
                    { key: 'anniversary', label: 'Special occasion', icon: SunMedium },
                  ].map((option) => {
                    const checked = preferences[option.key as 'transport' | 'housekeeping' | 'anniversary'];

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => togglePreferenceFlag(option.key as 'transport' | 'housekeeping' | 'anniversary')}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition',
                          checked ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                        )}
                      >
                        <option.icon className="h-4 w-4 shrink-0" />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            <SectionCard eyebrow="Concierge" title="Add a note" action={<TonePill label="Live queue" />}>
              <form className="space-y-3" onSubmit={saveNote}>
                <textarea
                  value={conciergeNote}
                  onChange={(event) => setConciergeNote(event.target.value)}
                  rows={4}
                  className="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  placeholder="Airport arrival time, dietary request, room preference, or anything else the team should know..."
                />
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  <MessageSquareMore className="h-4 w-4" />
                  Send to concierge
                </button>
              </form>
            </SectionCard>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href={`mailto:${activeReservation?.email ?? 'arrowbeachresort@gmail.com'}`} className="flex items-center justify-between rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                Email support
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="https://wa.me/94775290351" className="flex items-center justify-between rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                WhatsApp concierge
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function BedIcon({ className }: { className?: string }) {
  return <div className={cn('relative h-5 w-5', className)}><div className="absolute bottom-0 left-0 right-0 h-2 rounded-sm bg-current" /><div className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-current" /></div>;
}