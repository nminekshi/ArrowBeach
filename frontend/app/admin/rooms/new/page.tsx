'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    subtitle: '',
    price: '',
    breakfast: '',
    description: '',
    image: '',
    images: '',
    amenities: '',
    fullAmenities: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        fullAmenities: formData.fullAmenities.split(',').map((s) => s.trim()).filter(Boolean),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.ok) {
        router.push('/admin/rooms');
        router.refresh();
      } else {
        alert('Failed to save room');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 pb-12">
      <div>
        <Link href="/admin/rooms" className="inline-flex items-center text-base font-semibold text-ocean-700 hover:text-ocean-900 transition mb-6">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Rooms
        </Link>
        <h1 className="text-4xl font-bold text-slate-900">Add New Room</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">Room Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" placeholder="e.g. Deluxe Beach View Double Room" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">Room Type (Identifier)</label>
            <input required type="text" name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" placeholder="e.g. Deluxe Beach View Double Room" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Subtitle (Eyebrow text)</label>
          <input required type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" placeholder="e.g. Inspired by the Deluxe Beach View Double Room" />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none" placeholder="A polished retreat..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">Base Price</label>
            <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" placeholder="e.g. Rs 10,500/night" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">Breakfast Rate</label>
            <input type="text" name="breakfast" value={formData.breakfast} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" placeholder="e.g. Rs 12,500/night with breakfast" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Main Image URL</label>
          <input required type="text" name="image" value={formData.image} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" placeholder="e.g. /images/room.jpg" />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">All Gallery Images (comma separated URLs)</label>
          <textarea name="images" value={formData.images} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none" placeholder="/images/1.jpg, /images/2.jpg" />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Short Amenities (homepage - comma separated)</label>
          <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" placeholder="Balcony, Ocean view, King bed" />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Full Amenities (room page - comma separated)</label>
          <textarea name="fullAmenities" value={formData.fullAmenities} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none" placeholder="Balcony, Ocean view, King bed, Air conditioning, Free WiFi..." />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="px-10 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-base shadow-sm">
            {loading ? 'Saving...' : 'Save Room'}
          </button>
        </div>
      </form>
    </div>
  );
}
