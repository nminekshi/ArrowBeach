'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BedDouble, Calendar, Users, Plus, ImageIcon, MessageSquare, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
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
    ]).then(([roomsRes, bookingsRes, messagesRes]) => {
      setRooms(roomsRes.rooms || []);
      setBookings(bookingsRes.bookings || []);
      setMessages(messagesRes.messages || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [seeded]);

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckins = bookings.filter(b => b.checkIn === todayStr);
  const unreadMessages = messages.filter(m => !m.read);

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
              <p className="text-base text-slate-500 font-medium">Pending Bookings</p>
              <p className="text-4xl font-bold text-slate-900 mt-1.5">{pendingBookings.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 font-medium">Today&apos;s Check-ins</p>
              <p className="text-4xl font-bold text-slate-900 mt-1.5">{todayCheckins.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 font-medium">Unread Messages</p>
              <p className="text-4xl font-bold text-slate-900 mt-1.5">{unreadMessages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <MessageSquare size={24} />
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
