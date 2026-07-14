'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = () => {
    fetch('/api/rooms').then(r => r.json()).then(data => {
      setRooms(data.rooms || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const deleteRoom = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
    fetchRooms();
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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rooms</h1>
          <p className="text-slate-600 mt-1 text-base">Manage your hotel rooms and pricing.</p>
        </div>
        <Link href="/admin/rooms/new" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-base shadow-sm">
          <Plus size={20} />
          Add Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-base">
          No rooms added yet. Click &quot;Add Room&quot; to create one.
        </div>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room: any) => (
            <div key={room.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-64 h-48 sm:h-auto bg-slate-100 flex-shrink-0">
                {room.image && (
                  <Image src={room.image} alt={room.name} fill className="object-cover" />
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">{room.subtitle}</p>
                      <h3 className="text-xl font-bold text-slate-900">{room.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-slate-900">{room.price}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{room.breakfast}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-base text-slate-600 line-clamp-2">{room.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {room.amenities?.slice(0, 4).map((a: string) => (
                      <span key={a} className="px-3 py-1 bg-slate-100 rounded-md text-sm text-slate-700 font-medium">{a}</span>
                    ))}
                    {room.amenities?.length > 4 && (
                      <span className="px-3 py-1 bg-slate-100 rounded-md text-sm text-slate-500 font-medium">+{room.amenities.length - 4}</span>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Link href={`/admin/rooms/${room.id}`} className="inline-flex items-center gap-2 px-4 py-2 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                    <Edit2 size={16} /> Edit
                  </Link>
                  <button onClick={() => deleteRoom(room.id)} className="inline-flex items-center gap-2 px-4 py-2 text-base font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
