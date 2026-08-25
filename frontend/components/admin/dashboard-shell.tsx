'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  Gift,
  LogOut,
  Mail,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Shield,
  SunMedium,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';

import {
  adminMenu,
  adminSummaryCards,
  bookingTrendSeries,
  chartStats,
  overviewMetrics,
  recentBookings,
  recentCustomers,
  revenueSeries,
} from '@/data/admin';

type AdminSection = (typeof adminMenu)[number]['label'];

type StatusTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  amenities: string[];
  featured: boolean;
};

type Booking = {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Checked-in' | 'Checked-out' | 'Cancelled';
  amount: number;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  stays: number;
  vip: boolean;
  blocked: boolean;
};

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  featured: boolean;
};

type Offer = {
  id: string;
  title: string;
  details: string;
  expiry: string;
  active: boolean;
};

type Review = {
  id: string;
  guest: string;
  rating: number;
  comment: string;
  status: 'Pending' | 'Approved' | 'Hidden';
  reply: string;
};

type MessageItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
};

type Settings = {
  hotelName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  breakfast: string;
};

type WorkspaceState = {
  rooms: Room[];
  bookings: Booking[];
  customers: Customer[];
  gallery: GalleryItem[];
  offers: Offer[];
  reviews: Review[];
  messages: MessageItem[];
  settings: Settings;
};

const storageKey = 'arrow-beach-admin-workspace-v1';

const initialState: WorkspaceState = {
  rooms: [
    {
      id: 'room-1',
      name: 'Ocean View Suite',
      type: 'Suite',
      price: 160,
      capacity: 3,
      status: 'Available',
      amenities: ['Sea view', 'Balcony', 'Mini bar'],
      featured: true,
    },
    {
      id: 'room-2',
      name: 'Family Retreat',
      type: 'Family',
      price: 120,
      capacity: 4,
      status: 'Occupied',
      amenities: ['Two beds', 'Living space', 'Pool access'],
      featured: false,
    },
    {
      id: 'room-3',
      name: 'Garden Deluxe',
      type: 'Deluxe',
      price: 90,
      capacity: 2,
      status: 'Maintenance',
      amenities: ['Garden view', 'King bed', 'Work desk'],
      featured: false,
    },
  ],
  bookings: [
    {
      id: 'booking-1',
      guest: 'Nimali Perera',
      room: 'Ocean View Suite',
      checkIn: '27 Jun',
      checkOut: '29 Jun',
      status: 'Confirmed',
      amount: 70,
    },
    {
      id: 'booking-2',
      guest: 'Arjun Patel',
      room: 'Family Retreat',
      checkIn: '28 Jun',
      checkOut: '01 Jul',
      status: 'Pending',
      amount: 150,
    },
    {
      id: 'booking-3',
      guest: 'Michelle Tan',
      room: 'Garden Deluxe',
      checkIn: '30 Jun',
      checkOut: '02 Jul',
      status: 'Checked-in',
      amount: 80,
    },
    {
      id: 'booking-4',
      guest: 'Kevin Silva',
      room: 'Family Retreat',
      checkIn: '01 Jul',
      checkOut: '03 Jul',
      status: 'Cancelled',
      amount: 100,
    },
  ],
  customers: [
    { id: 'customer-1', name: 'Nimali Perera', email: 'nimali@example.com', phone: '+94 77 111 2233', stays: 4, vip: true, blocked: false },
    { id: 'customer-2', name: 'Arjun Patel', email: 'arjun@example.com', phone: '+91 98 1122 3344', stays: 2, vip: false, blocked: false },
    { id: 'customer-3', name: 'Michelle Tan', email: 'michelle@example.com', phone: '+65 8123 4567', stays: 1, vip: false, blocked: false },
    { id: 'customer-4', name: 'Sanjeewa Fernando', email: 'sanjeewa@example.com', phone: '+94 77 222 9988', stays: 6, vip: true, blocked: false },
  ],
  gallery: [
    { id: 'gallery-1', title: 'Infinity Pool', category: 'Facilities', featured: true },
    { id: 'gallery-2', title: 'Sunset Lounge', category: 'Experience', featured: true },
    { id: 'gallery-3', title: 'Ocean Room', category: 'Rooms', featured: false },
    { id: 'gallery-4', title: 'Restaurant Terrace', category: 'Dining', featured: false },
  ],
  offers: [
    { id: 'offer-1', title: 'Early Bird Escape', details: '15% off direct bookings made 30 days in advance.', expiry: '30 Jul 2026', active: true },
    { id: 'offer-2', title: 'Family Summer Stay', details: 'Complimentary breakfast for two children.', expiry: '15 Aug 2026', active: true },
    { id: 'offer-3', title: 'Spa Weekend', details: 'Free spa access for suite bookings.', expiry: '10 Sep 2026', active: false },
  ],
  reviews: [
    { id: 'review-1', guest: 'M. Fernando', rating: 5, comment: 'Perfect beach stay and the team was attentive.', status: 'Approved', reply: 'Thank you for staying with us.' },
    { id: 'review-2', guest: 'A. Patel', rating: 4, comment: 'Great room, smooth booking process.', status: 'Pending', reply: '' },
    { id: 'review-3', guest: 'S. Tan', rating: 5, comment: 'Loved the sunset and the food selection.', status: 'Approved', reply: 'We are delighted you enjoyed it.' },
  ],
  messages: [
    { id: 'message-1', name: 'Priya', email: 'priya@example.com', subject: 'Airport pickup', message: 'Can you arrange airport pickup for 4 guests?', status: 'Unread' },
    { id: 'message-2', name: 'David', email: 'david@example.com', subject: 'Conference room', message: 'Is the meeting space available for Friday?', status: 'Read' },
    { id: 'message-3', name: 'Anna', email: 'anna@example.com', subject: 'Late checkout', message: 'Can we request late checkout for our suite?', status: 'Replied' },
  ],
  settings: {
    hotelName: 'Arrow Beach Hotel',
    phone: '+94 11 555 0199',
    email: 'arrowbeachresort@gmail.com',
    address: 'Bentota, Sri Lanka',
    currency: 'USD',
    breakfast: '7:00 AM - 10:00 AM',
  },
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

function getTone(status: string): StatusTone {
  const normalized = status.toLowerCase();

  if (normalized.includes('confirmed') || normalized.includes('approved') || normalized.includes('available') || normalized.includes('checked-in') || normalized.includes('replied')) {
    return 'success';
  }

  if (normalized.includes('pending') || normalized.includes('read') || normalized.includes('warning')) {
    return 'warning';
  }

  if (normalized.includes('cancelled') || normalized.includes('hidden') || normalized.includes('blocked') || normalized.includes('maintenance')) {
    return 'danger';
  }

  return 'info';
}

function TonePill({ label }: { label: string }) {
  const tone = getTone(label);
  const styles: Record<StatusTone, string> = {
    default: 'bg-slate-100 text-slate-700 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    danger: 'bg-rose-50 text-rose-700 ring-rose-200',
    info: 'bg-sky-50 text-sky-700 ring-sky-200',
  };

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${styles[tone]}`}>{label}</span>;
}

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function MiniBarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value));

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-4">
      {data.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
          <div className="mb-3 flex h-24 items-end rounded-xl bg-gradient-to-b from-slate-100 to-white p-2">
            <div className="w-full rounded-xl bg-gradient-to-t from-cyan-500 via-sky-500 to-emerald-400 shadow-[0_12px_24px_rgba(14,165,233,0.2)]" style={{ height: `${Math.max(10, (item.value / max) * 100)}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardShell() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState<WorkspaceState>(initialState);
  const [roomDraft, setRoomDraft] = useState({ name: '', type: 'Suite', price: 60, capacity: 2, amenities: 'Sea view, Balcony' });
  const [offerDraft, setOfferDraft] = useState({ title: '', details: '', expiry: '' });
  const [galleryDraft, setGalleryDraft] = useState({ title: '', category: 'Rooms' });
  const [messageReply, setMessageReply] = useState<Record<string, string>>({});
  const [reviewReply, setReviewReply] = useState<Record<string, string>>({});
  const topNavTabs = [
    { label: 'Overview', target: 'Dashboard' },
    { label: 'Operations', target: 'Room Management' },
    { label: 'Revenue', target: 'Reports & Analytics' },
    { label: 'Reports', target: 'Reports & Analytics' },
    { label: 'Settings', target: 'Settings' },
  ] as const;

  useEffect(() => {
    setIsMounted(true);

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setState({ ...initialState, ...JSON.parse(stored) } as WorkspaceState);
      }
    } catch {
      // Ignore malformed local storage and fall back to seed data.
    }
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [isMounted, state]);

  const filteredRooms = useMemo(() => {
    return state.rooms.filter((room) => `${room.name} ${room.type} ${room.status}`.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, state.rooms]);

  const filteredBookings = useMemo(() => {
    return state.bookings.filter((booking) => `${booking.guest} ${booking.room} ${booking.status}`.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, state.bookings]);

  const filteredCustomers = useMemo(() => {
    return state.customers.filter((customer) => `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, state.customers]);

  const filteredMessages = useMemo(() => {
    return state.messages.filter((message) => `${message.name} ${message.subject} ${message.status}`.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, state.messages]);

  const filteredReviews = useMemo(() => {
    return state.reviews.filter((review) => `${review.guest} ${review.comment} ${review.status}`.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, state.reviews]);

  const updateRoom = (roomId: string, patch: Partial<Room>) => {
    setState((current) => ({
      ...current,
      rooms: current.rooms.map((room) => (room.id === roomId ? { ...room, ...patch } : room)),
    }));
  };

  const updateBooking = (bookingId: string, status: Booking['status']) => {
    setState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
    }));
  };

  const updateCustomer = (customerId: string, patch: Partial<Customer>) => {
    setState((current) => ({
      ...current,
      customers: current.customers.map((customer) => (customer.id === customerId ? { ...customer, ...patch } : customer)),
    }));
  };

  const updateGallery = (galleryId: string, patch: Partial<GalleryItem>) => {
    setState((current) => ({
      ...current,
      gallery: current.gallery.map((item) => (item.id === galleryId ? { ...item, ...patch } : item)),
    }));
  };

  const updateOffer = (offerId: string, patch: Partial<Offer>) => {
    setState((current) => ({
      ...current,
      offers: current.offers.map((offer) => (offer.id === offerId ? { ...offer, ...patch } : offer)),
    }));
  };

  const updateReview = (reviewId: string, patch: Partial<Review>) => {
    setState((current) => ({
      ...current,
      reviews: current.reviews.map((review) => (review.id === reviewId ? { ...review, ...patch } : review)),
    }));
  };

  const updateMessage = (messageId: string, patch: Partial<MessageItem>) => {
    setState((current) => ({
      ...current,
      messages: current.messages.map((message) => (message.id === messageId ? { ...message, ...patch } : message)),
    }));
  };

  const deleteRoom = (roomId: string) => {
    setState((current) => ({
      ...current,
      rooms: current.rooms.filter((room) => room.id !== roomId),
    }));
  };

  const deleteCustomer = (customerId: string) => {
    setState((current) => ({
      ...current,
      customers: current.customers.filter((customer) => customer.id !== customerId),
    }));
  };

  const deleteGalleryItem = (galleryId: string) => {
    setState((current) => ({
      ...current,
      gallery: current.gallery.filter((item) => item.id !== galleryId),
    }));
  };

  const deleteOffer = (offerId: string) => {
    setState((current) => ({
      ...current,
      offers: current.offers.filter((offer) => offer.id !== offerId),
    }));
  };

  const deleteReview = (reviewId: string) => {
    setState((current) => ({
      ...current,
      reviews: current.reviews.filter((review) => review.id !== reviewId),
    }));
  };

  const deleteMessage = (messageId: string) => {
    setState((current) => ({
      ...current,
      messages: current.messages.filter((message) => message.id !== messageId),
    }));
  };

  const addRoom = () => {
    if (!roomDraft.name.trim()) {
      return;
    }

    setState((current) => ({
      ...current,
      rooms: [
        {
          id: `room-${Date.now()}`,
          name: roomDraft.name.trim(),
          type: roomDraft.type,
          price: roomDraft.price,
          capacity: roomDraft.capacity,
          status: 'Available',
          amenities: roomDraft.amenities
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          featured: false,
        },
        ...current.rooms,
      ],
    }));

    setRoomDraft({ name: '', type: 'Suite', price: 60, capacity: 2, amenities: 'Sea view, Balcony' });
  };

  const addOffer = () => {
    if (!offerDraft.title.trim()) {
      return;
    }

    setState((current) => ({
      ...current,
      offers: [
        {
          id: `offer-${Date.now()}`,
          title: offerDraft.title.trim(),
          details: offerDraft.details.trim(),
          expiry: offerDraft.expiry.trim() || 'Open ended',
          active: true,
        },
        ...current.offers,
      ],
    }));

    setOfferDraft({ title: '', details: '', expiry: '' });
  };

  const addGalleryItem = () => {
    if (!galleryDraft.title.trim()) {
      return;
    }

    setState((current) => ({
      ...current,
      gallery: [
        {
          id: `gallery-${Date.now()}`,
          title: galleryDraft.title.trim(),
          category: galleryDraft.category,
          featured: false,
        },
        ...current.gallery,
      ],
    }));

    setGalleryDraft({ title: '', category: 'Rooms' });
  };

  const exportSnapshot = () => {
    const snapshot = JSON.stringify(state, null, 2);
    const blob = new Blob([snapshot], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'arrow-beach-admin-snapshot.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalRevenue = state.bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const occupancyRate = Math.round((state.rooms.filter((room) => room.status === 'Occupied').length / Math.max(state.rooms.length, 1)) * 100);
  const pendingActions = state.bookings.filter((booking) => booking.status === 'Pending').length + state.messages.filter((message) => message.status === 'Unread').length + state.reviews.filter((review) => review.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef4f9_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <aside className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-slate-200/80 bg-slate-950 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="border-b border-white/10 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Arrow Beach Hotel</p>
                  <h1 className="mt-2 text-2xl font-semibold">Admin Workspace</h1>
                </div>
                <button className="rounded-2xl border border-white/10 p-2 text-white/80 transition hover:bg-white/10 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 rounded-3xl bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Hotel operations live</p>
                    <p className="text-xs text-white/60">Local storage enabled</p>
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {adminMenu.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.label;

                return (
                  <button
                    key={item.label}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${isActive ? 'bg-white text-slate-950 shadow-lg shadow-cyan-500/10' : 'text-white/75 hover:bg-white/8 hover:text-white'}`}
                    onClick={() => setActiveSection(item.label as AdminSection)}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {isActive ? <ChevronRight className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10" onClick={() => setActiveSection('Logout')}>
                <span className="flex items-center gap-3">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 xl:px-8">
              <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm lg:hidden" onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
                <Menu className="h-5 w-5" />
              </button>

              <button className="hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm lg:inline-flex" onClick={() => setIsSidebarOpen((current) => !current)} aria-label="Toggle sidebar">
                {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>

              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="Search rooms, bookings, customers, messages..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <button className="hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm sm:inline-flex" aria-label="Alerts">
                <Bell className="h-5 w-5" />
              </button>

              <button className="hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm sm:inline-flex" aria-label="Theme switcher">
                <SunMedium className="h-5 w-5" />
              </button>

              <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm xl:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                  AB
                </div>
                <div>
                  <p className="text-sm font-semibold">Hotel Admin</p>
                  <p className="text-xs text-slate-500">Operations desk</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 px-4 pb-4 sm:px-6 xl:px-8">
              {topNavTabs.map((item) => (
                <button
                  key={item.label}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeSection === item.target ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => setActiveSection(item.target)}
                >
                  {item.label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Live local admin mode
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 xl:px-8">
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-4">
                {adminSummaryCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">{card.label}</p>
                          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-950 p-3 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                <SectionCard title="Overview" action={<TonePill label="Operational" />}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {overviewMetrics.map((metric) => {
                      const Icon = metric.icon;

                      return (
                        <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm text-slate-500">{metric.label}</p>
                              <p className="mt-2 text-xl font-semibold text-slate-950">{metric.value}</p>
                              <p className="mt-1 text-xs text-slate-500">{metric.change}</p>
                            </div>
                            <Icon className="h-5 w-5 text-sky-500" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>

                <SectionCard title="Quick tools" action={<button className="text-sm font-medium text-sky-700" onClick={exportSnapshot}>Export JSON</button>}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm" onClick={() => setActiveSection('Room Management')}>
                      <span>
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Plus className="h-4 w-4" /> Add room</span>
                        <span className="mt-1 block text-xs text-slate-500">Create inventory entries.</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>

                    <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm" onClick={() => setActiveSection('Booking Management')}>
                      <span>
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900"><CalendarCheck2 className="h-4 w-4" /> Review bookings</span>
                        <span className="mt-1 block text-xs text-slate-500">Process stay statuses.</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>

                    <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm" onClick={() => setActiveSection('Reports & Analytics')}>
                      <span>
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Wallet className="h-4 w-4" /> View revenue</span>
                        <span className="mt-1 block text-xs text-slate-500">Inspect trends and export.</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>

                    <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm" onClick={() => setActiveSection('Messages')}>
                      <span>
                        <span className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Mail className="h-4 w-4" /> Respond to guests</span>
                        <span className="mt-1 block text-xs text-slate-500">Reply to inquiries.</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </SectionCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <SectionCard title="Revenue trend" action={<button className="flex items-center gap-2 text-sm font-medium text-slate-600"><RefreshCw className="h-4 w-4" /> Refresh</button>}>
                  <MiniBarChart data={revenueSeries} />
                </SectionCard>

                <SectionCard title="Booking pulse" action={<TonePill label={`${occupancyRate}% occupancy`} />}>
                  <div className="space-y-4">
                    {chartStats.map((stat) => {
                      const Icon = stat.icon;

                      return (
                        <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                          <div>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                            <p className="mt-1 text-lg font-semibold text-slate-950">{stat.value}</p>
                          </div>
                          <Icon className="h-5 w-5 text-sky-500" />
                        </div>
                      );
                    })}

                    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-white/70">Live revenue estimate</p>
                          <p className="mt-2 text-2xl font-semibold">{formatCurrency(totalRevenue)}</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3">
                          <Download className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>

              {activeSection === 'Dashboard' && (
                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                  <SectionCard title="Recent bookings" action={<TonePill label="Live queue" />}>
                    <div className="space-y-3">
                      {recentBookings.map((booking) => (
                        <div key={booking.guest} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                          <div>
                            <p className="font-semibold text-slate-950">{booking.guest}</p>
                            <p className="text-sm text-slate-500">{booking.room} · {booking.dates}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <TonePill label={booking.status} />
                            <p className="text-sm font-semibold text-slate-950">{booking.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Recent customers" action={<TonePill label="CRM" />}>
                    <div className="space-y-3">
                      {recentCustomers.map((customer) => (
                        <div key={customer.email} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-950">{customer.name}</p>
                              <p className="text-sm text-slate-500">{customer.email}</p>
                            </div>
                            <TonePill label={customer.stays} />
                          </div>
                          <p className="mt-3 text-sm text-slate-600">{customer.phone}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}

              {activeSection === 'Room Management' && (
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <SectionCard title="Create room">
                    <div className="grid gap-4">
                      <Field label="Room name">
                        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={roomDraft.name} onChange={(event) => setRoomDraft((current) => ({ ...current, name: event.target.value }))} />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Type">
                          <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={roomDraft.type} onChange={(event) => setRoomDraft((current) => ({ ...current, type: event.target.value }))}>
                            <option>Suite</option>
                            <option>Deluxe</option>
                            <option>Family</option>
                            <option>Standard</option>
                          </select>
                        </Field>
                        <Field label="Capacity">
                          <input type="number" min="1" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={roomDraft.capacity} onChange={(event) => setRoomDraft((current) => ({ ...current, capacity: Number(event.target.value) }))} />
                        </Field>
                      </div>
                      <Field label="Price ($)">
                        <input type="number" min="0" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={roomDraft.price} onChange={(event) => setRoomDraft((current) => ({ ...current, price: Number(event.target.value) }))} />
                      </Field>
                      <Field label="Amenities">
                        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={roomDraft.amenities} onChange={(event) => setRoomDraft((current) => ({ ...current, amenities: event.target.value }))} />
                      </Field>
                      <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white" onClick={addRoom}>
                        <Plus className="h-4 w-4" /> Add room
                      </button>
                    </div>
                  </SectionCard>

                  <SectionCard title="Rooms list" action={<TonePill label={`${filteredRooms.length} rooms`} />}>
                    <div className="space-y-3">
                      {filteredRooms.map((room) => (
                        <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-950">{room.name}</p>
                                {room.featured ? <TonePill label="Featured" /> : null}
                              </div>
                              <p className="text-sm text-slate-500">{room.type} · {room.capacity} guests · {formatCurrency(room.price)}</p>
                              <p className="mt-2 text-xs text-slate-500">{room.amenities.join(' · ')}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <TonePill label={room.status} />
                              <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateRoom(room.id, { status: room.status === 'Available' ? 'Occupied' : 'Available' })}>
                                Toggle status
                              </button>
                              <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateRoom(room.id, { featured: !room.featured })}>
                                Feature
                              </button>
                              <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => deleteRoom(room.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}

              {activeSection === 'Booking Management' && (
                <SectionCard title="Bookings" action={<TonePill label={`${filteredBookings.length} bookings`} />}>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {filteredBookings.map((booking) => (
                      <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-950">{booking.guest}</p>
                            <p className="text-sm text-slate-500">{booking.room}</p>
                            <p className="mt-1 text-xs text-slate-500">{booking.checkIn} - {booking.checkOut}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-950">{formatCurrency(booking.amount)}</p>
                            <TonePill label={booking.status} />
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(['Confirmed', 'Pending', 'Checked-in', 'Checked-out', 'Cancelled'] as const).map((status) => (
                            <button key={status} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateBooking(booking.id, status)}>
                              {status}
                            </button>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </SectionCard>
              )}

              {activeSection === 'Customer Management' && (
                <SectionCard title="Customers" action={<TonePill label={`${filteredCustomers.length} guests`} />}>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {filteredCustomers.map((customer) => (
                      <article key={customer.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-950">{customer.name}</p>
                            <p className="text-sm text-slate-500">{customer.email}</p>
                            <p className="text-sm text-slate-500">{customer.phone}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <TonePill label={customer.vip ? 'VIP' : `${customer.stays} stays`} />
                            <TonePill label={customer.blocked ? 'Blocked' : 'Active'} />
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateCustomer(customer.id, { vip: !customer.vip })}>
                            Toggle VIP
                          </button>
                          <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateCustomer(customer.id, { blocked: !customer.blocked })}>
                            {customer.blocked ? 'Unblock' : 'Block'}
                          </button>
                          <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => deleteCustomer(customer.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </SectionCard>
              )}

              {activeSection === 'Gallery Management' && (
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <SectionCard title="Add gallery item">
                    <div className="grid gap-4">
                      <Field label="Title">
                        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={galleryDraft.title} onChange={(event) => setGalleryDraft((current) => ({ ...current, title: event.target.value }))} />
                      </Field>
                      <Field label="Category">
                        <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={galleryDraft.category} onChange={(event) => setGalleryDraft((current) => ({ ...current, category: event.target.value }))}>
                          <option>Rooms</option>
                          <option>Dining</option>
                          <option>Facilities</option>
                          <option>Experience</option>
                        </select>
                      </Field>
                      <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white" onClick={addGalleryItem}>
                        <FileImage className="h-4 w-4" /> Add image entry
                      </button>
                    </div>
                  </SectionCard>

                  <SectionCard title="Gallery library" action={<TonePill label={`${state.gallery.length} items`} />}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {state.gallery.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-950">{item.title}</p>
                              <p className="text-sm text-slate-500">{item.category}</p>
                            </div>
                            {item.featured ? <TonePill label="Featured" /> : null}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateGallery(item.id, { featured: !item.featured })}>
                              Toggle featured
                            </button>
                            <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => deleteGalleryItem(item.id)}>
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}

              {activeSection === 'Special Offers' && (
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <SectionCard title="New offer">
                    <div className="grid gap-4">
                      <Field label="Title">
                        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={offerDraft.title} onChange={(event) => setOfferDraft((current) => ({ ...current, title: event.target.value }))} />
                      </Field>
                      <Field label="Details">
                        <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={offerDraft.details} onChange={(event) => setOfferDraft((current) => ({ ...current, details: event.target.value }))} />
                      </Field>
                      <Field label="Expiry">
                        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={offerDraft.expiry} onChange={(event) => setOfferDraft((current) => ({ ...current, expiry: event.target.value }))} />
                      </Field>
                      <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white" onClick={addOffer}>
                        <Gift className="h-4 w-4" /> Publish offer
                      </button>
                    </div>
                  </SectionCard>

                  <SectionCard title="Offer board" action={<TonePill label={`${state.offers.filter((offer) => offer.active).length} active`} />}>
                    <div className="space-y-3">
                      {state.offers.map((offer) => (
                        <article key={offer.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-950">{offer.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{offer.details}</p>
                              <p className="mt-2 text-xs text-slate-500">Expiry: {offer.expiry}</p>
                            </div>
                            <TonePill label={offer.active ? 'Active' : 'Paused'} />
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateOffer(offer.id, { active: !offer.active })}>
                              {offer.active ? 'Pause' : 'Activate'}
                            </button>
                            <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => deleteOffer(offer.id)}>
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}

              {activeSection === 'Reviews' && (
                <SectionCard title="Guest reviews" action={<TonePill label={`${filteredReviews.length} reviews`} />}>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {filteredReviews.map((review) => (
                      <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-950">{review.guest}</p>
                            <p className="mt-2 text-sm text-slate-500">{review.comment}</p>
                            <p className="mt-2 text-xs text-slate-500">{Array.from({ length: review.rating }, (_, index) => index + 1).map(() => '★').join(' ')}</p>
                          </div>
                          <TonePill label={review.status} />
                        </div>
                        <Field label="Reply">
                          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" value={reviewReply[review.id] ?? review.reply} onChange={(event) => setReviewReply((current) => ({ ...current, [review.id]: event.target.value }))} />
                        </Field>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateReview(review.id, { status: 'Approved', reply: reviewReply[review.id] ?? review.reply })}>
                            Approve
                          </button>
                          <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateReview(review.id, { status: 'Hidden' })}>
                            Hide
                          </button>
                          <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => deleteReview(review.id)}>
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </SectionCard>
              )}

              {activeSection === 'Messages' && (
                <SectionCard title="Messages" action={<TonePill label={`${filteredMessages.length} inbox items`} />}>
                  <div className="space-y-3">
                    {filteredMessages.map((message) => (
                      <article key={message.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-950">{message.name}</p>
                            <p className="text-sm text-slate-500">{message.email}</p>
                            <p className="mt-2 text-sm text-slate-600">{message.subject}</p>
                            <p className="mt-1 text-sm text-slate-500">{message.message}</p>
                          </div>
                          <TonePill label={message.status} />
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                          <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" placeholder="Write a reply" value={messageReply[message.id] ?? ''} onChange={(event) => setMessageReply((current) => ({ ...current, [message.id]: event.target.value }))} />
                          <div className="flex flex-wrap gap-2">
                            <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateMessage(message.id, { status: 'Replied' })}>
                              Reply
                            </button>
                            <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => updateMessage(message.id, { status: 'Read' })}>
                              Mark read
                            </button>
                            <button className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium" onClick={() => deleteMessage(message.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </SectionCard>
              )}

              {activeSection === 'Reports & Analytics' && (
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <SectionCard title="Reports summary" action={<button className="inline-flex items-center gap-2 text-sm font-medium text-slate-600" onClick={exportSnapshot}><Download className="h-4 w-4" /> Export report</button>}>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">Bookings</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">{state.bookings.length}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">Revenue</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCurrency(totalRevenue)}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">Pending actions</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">{pendingActions}</p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {['Occupancy', 'Revenue', 'Customer growth', 'Message response'].map((label) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                          <p className="text-sm text-slate-500">{label}</p>
                          <p className="mt-2 text-xl font-semibold text-slate-950">Healthy</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Booking trend" action={<TonePill label="Monthly" />}>
                    <MiniBarChart data={bookingTrendSeries} />
                  </SectionCard>
                </div>
              )}

              {activeSection === 'Settings' && (
                <SectionCard title="Hotel settings" action={<TonePill label="Saved locally" />}>
                  <div className="grid gap-4 xl:grid-cols-2">
                    {([
                      ['hotelName', 'Hotel name'],
                      ['phone', 'Phone'],
                      ['email', 'Email'],
                      ['address', 'Address'],
                      ['currency', 'Currency'],
                      ['breakfast', 'Breakfast time'],
                    ] as const).map(([key, label]) => (
                      <Field key={key} label={label}>
                        <input
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                          value={state.settings[key]}
                          onChange={(event) =>
                            setState((current) => ({
                              ...current,
                              settings: {
                                ...current.settings,
                                [key]: event.target.value,
                              },
                            }))
                          }
                        />
                      </Field>
                    ))}
                  </div>
                </SectionCard>
              )}

              {activeSection === 'Logout' && (
                <SectionCard title="Session">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">Ready to end the current admin session.</p>
                      <p className="text-sm text-slate-500">The current workspace is stored locally and will remain available after refresh.</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white" onClick={() => window.location.assign('/')}>
                      <LogOut className="h-4 w-4" /> Return to site
                    </button>
                  </div>
                </SectionCard>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}