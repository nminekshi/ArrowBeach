'use client';

import { useEffect, useState } from 'react';
import { Trash2, Check, XCircle } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    fetch('/api/bookings').then(r => r.json()).then(data => {
      setBookings(data.bookings || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    fetchBookings();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
        <p className="text-slate-600 mt-1 text-base">Manage all booking requests and reservations.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-base">No bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Guest</th>
                  <th className="px-6 py-4 font-semibold">Room</th>
                  <th className="px-6 py-4 font-semibold">Check-in</th>
                  <th className="px-6 py-4 font-semibold">Check-out</th>
                  <th className="px-6 py-4 font-semibold">Guests</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 text-base">{b.customerName}</p>
                      <p className="text-sm text-slate-400 mt-1">{b.email}</p>
                      <p className="text-sm text-slate-400">{b.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{b.roomType}</td>
                    <td className="px-6 py-4 text-slate-700">{b.checkIn}</td>
                    <td className="px-6 py-4 text-slate-700">{b.checkOut}</td>
                    <td className="px-6 py-4 text-slate-700">{b.guests}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.status !== 'Confirmed' && (
                          <button onClick={() => updateStatus(b.id, 'Confirmed')} className="p-2.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="Confirm">
                            <Check size={18} />
                          </button>
                        )}
                        {b.status !== 'Cancelled' && (
                          <button onClick={() => updateStatus(b.id, 'Cancelled')} className="p-2.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition" title="Cancel">
                            <XCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => deleteBooking(b.id)} className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {bookings.some(b => b.specialRequests) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Special Requests</h3>
          <div className="space-y-4">
            {bookings.filter(b => b.specialRequests).map(b => (
              <div key={b.id} className="flex gap-4 text-base">
                <span className="font-semibold text-slate-800 min-w-[140px]">{b.customerName}:</span>
                <span className="text-slate-600">{b.specialRequests}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
