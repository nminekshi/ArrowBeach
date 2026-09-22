'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BedDouble, Calendar, Users, Plus, ImageIcon, MessageSquare, ArrowRight, CheckCircle, DollarSign, Clock, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed database first, then load data
    fetch('/api/seed')
      .then(() => setSeeded(true))
      .catch(() => setSeeded(true)); // continue even if seed fails
  }, []);

  useEffect(() => {
    if (!seeded) return;
    Promise.all([
      fetch('/api/rooms').then(r => r.json()),
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/messages').then(r => r.json()),
      fetch('/api/gallery').then(r => r.json()),
    ]).then(([roomsRes, bookingsRes, messagesRes, galleryRes]) => {
      setRooms(roomsRes.rooms || []);
      setBookings(bookingsRes.bookings || []);
      setMessages(messagesRes.messages || []);
      setGallery(galleryRes.gallery || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [seeded]);

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckins = bookings.filter(b => b.checkIn === todayStr);
  const todayCheckouts = bookings.filter(b => b.checkOut === todayStr);
  const unreadMessages = messages.filter(m => !m.read);

  // Compute estimated revenue from confirmed bookings by extracting price from room data
  const roomPriceMap: Record<string, number> = {};
  rooms.forEach(r => {
    const match = r.price?.match(/\$(\d+)/);
    if (match) roomPriceMap[r.type || r.name] = parseInt(match[1]);
  });

  const estimatedRevenue = confirmedBookings.reduce((sum, b) => {
    const pricePerNight = roomPriceMap[b.roomType] || 35;
    const checkIn = new Date(b.checkIn);
    const checkOut = new Date(b.checkOut);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    return sum + (pricePerNight * nights);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1 text-base">Here&apos;s what&apos;s happening at Arrow Beach Hotel today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 font-medium">Total Rooms</p>
              <p className="text-4xl font-bold text-slate-900 mt-1.5">{rooms.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <BedDouble size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 font-medium">Total Bookings</p>
              <p className="text-4xl font-bold text-slate-900 mt-1.5">{bookings.length}</p>
              <p className="text-sm text-slate-400 mt-1">{confirmedBookings.length} confirmed · {pendingBookings.length} pending</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 font-medium">Estimated Revenue</p>
              <p className="text-4xl font-bold text-slate-900 mt-1.5">${estimatedRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-400 mt-1">From {confirmedBookings.length} confirmed bookings</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 font-medium">Unread Messages</p>
              <p className="text-4xl font-bold text-slate-900 mt-1.5">{unreadMessages.length}</p>
              <p className="text-sm text-slate-400 mt-1">{messages.length} total messages</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{pendingBookings.length}</p>
            <p className="text-xs text-slate-500 font-medium">Pending</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{confirmedBookings.length}</p>
            <p className="text-xs text-slate-500 font-medium">Confirmed</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{todayCheckins.length}</p>
            <p className="text-xs text-slate-500 font-medium">Today&apos;s Check-ins</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ImageIcon size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{gallery.length}</p>
            <p className="text-xs text-slate-500 font-medium">Gallery Images</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-base text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-base">No bookings yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-100">
                      <th className="px-6 py-3.5 font-semibold">Guest</th>
                      <th className="px-6 py-3.5 font-semibold">Room</th>
                      <th className="px-6 py-3.5 font-semibold">Check-in</th>
                      <th className="px-6 py-3.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(0, 5).map((b: any) => (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 text-base">{b.customerName}</p>
                          <p className="text-sm text-slate-400 mt-0.5">{b.email}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">{b.roomType}</td>
                        <td className="px-6 py-4 text-slate-600">{b.checkIn}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/rooms/new" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition group">
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition">
                <Plus size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-base">Add New Room</p>
                <p className="text-sm text-slate-400 mt-0.5">Create a new room listing</p>
              </div>
            </Link>
            <Link href="/admin/gallery" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-sm transition group">
              <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition">
                <ImageIcon size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-base">Manage Gallery</p>
                <p className="text-sm text-slate-400 mt-0.5">Upload or organize photos</p>
              </div>
            </Link>
            <Link href="/admin/messages" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-green-300 hover:shadow-sm transition group">
              <div className="w-11 h-11 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-100 transition">
                <MessageSquare size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-base">View Messages</p>
                <p className="text-sm text-slate-400 mt-0.5">{unreadMessages.length} unread message{unreadMessages.length !== 1 ? 's' : ''}</p>
              </div>
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm transition group">
              <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-base">Manage Bookings</p>
                <p className="text-sm text-slate-400 mt-0.5">{pendingBookings.length} pending action{pendingBookings.length !== 1 ? 's' : ''}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      {unreadMessages.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Unread Messages</h2>
            <Link href="/admin/messages" className="text-base text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {unreadMessages.slice(0, 3).map((msg: any) => (
              <div key={msg.id} className="px-6 py-4 flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-slate-900">{msg.name}</p>
                    <span className="text-xs text-slate-400">·</span>
                    <p className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{msg.subject || 'No subject'}</p>
                  <p className="text-sm text-slate-400 mt-0.5 truncate">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
