'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetch(`/api/rooms/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const r = data.room;
          setFormData({
            name: r.name || '',
            type: r.type || '',
            subtitle: r.subtitle || '',
            price: r.price || '',
            breakfast: r.breakfast || '',
            description: r.description || '',
            image: r.image || '',
            images: r.images?.join(', ') || '',
            amenities: r.amenities?.join(', ') || '',
            fullAmenities: r.fullAmenities?.join(', ') || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const adjustPrice = (field: 'price' | 'breakfast', delta: number) => {
    setFormData((prev) => {
      const current = prev[field];
      if (!current) return prev;
      const match = current.match(/^(\D*)([\d,]+)(.*)$/);
      if (match) {
        const prefix = match[1];
        const numStr = match[2].replace(/,/g, '');
        const suffix = match[3];
        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          const newVal = Math.max(0, num + delta);
          const formattedNum = newVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return { ...prev, [field]: `${prefix}${formattedNum}${suffix}` };
        }
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSubmit = {
        ...formData,
        amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        fullAmenities: formData.fullAmenities.split(',').map((s) => s.trim()).filter(Boolean),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(`/api/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.ok) {
        router.push('/admin/rooms');
        router.refresh();
      } else {
        alert('Failed to update room');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-night/50">Loading room...</div>;

  return (
    <div className="w-full space-y-8 pb-12">
      <div>
        <Link href="/admin/rooms" className="inline-flex items-center text-base font-semibold text-ocean-700 hover:text-ocean-900 transition mb-6">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Rooms
        </Link>
        <h1 className="text-4xl font-bold text-slate-900">Edit Room</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[1.5rem] border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">Room Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">Room Type (Identifier)</label>
            <input required type="text" name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Subtitle (Eyebrow text)</label>
          <input required type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">Base Price</label>
            <div className="flex items-center gap-2">
              <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => adjustPrice('price', 1)} className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition">
                  <ChevronUp size={16} />
                </button>
                <button type="button" onClick={() => adjustPrice('price', -1)} className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-base font-semibold text-slate-700">Breakfast Rate</label>
            <div className="flex items-center gap-2">
              <input type="text" name="breakfast" value={formData.breakfast} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => adjustPrice('breakfast', 1)} className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition">
                  <ChevronUp size={16} />
                </button>
                <button type="button" onClick={() => adjustPrice('breakfast', -1)} className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Main Image</label>
          {formData.image && (
            <div className="mb-2">
              <img src={formData.image} alt="Main Image Preview" className="h-32 w-auto rounded-lg object-cover shadow-sm border border-slate-200" />
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);
                try {
                  const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
                  const data = await res.json();
                  if (data.success) {
                    setFormData({ ...formData, image: data.url });
                  } else {
                    alert('Upload failed');
                  }
                } catch (err) {
                  alert('Upload error');
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            />
          </div>

        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Gallery Images</label>
          {formData.images.split(',').filter(Boolean).length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {formData.images.split(',').map(s => s.trim()).filter(Boolean).map((imgUrl, idx) => (
                <div key={idx} className="relative group">
                  <img src={imgUrl} alt="Gallery Preview" className="h-20 w-24 object-cover rounded-lg border border-slate-200 shadow-sm" />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white/90 rounded-md p-1 text-red-600 opacity-0 group-hover:opacity-100 transition shadow"
                    onClick={() => {
                      const newUrls = formData.images.split(',').map(s => s.trim()).filter(Boolean);
                      newUrls.splice(idx, 1);
                      setFormData({ ...formData, images: newUrls.join(', ') });
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);
                try {
                  const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
                  const data = await res.json();
                  if (data.success) {
                    const currentUrls = formData.images.split(',').map(s => s.trim()).filter(Boolean);
                    currentUrls.push(data.url);
                    setFormData({ ...formData, images: currentUrls.join(', ') });
                  } else {
                    alert('Upload failed');
                  }
                } catch (err) {
                  alert('Upload error');
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            />
          </div>

        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Short Amenities (homepage - comma separated)</label>
          <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold text-slate-700">Full Amenities (room page - comma separated)</label>
          <textarea name="fullAmenities" value={formData.fullAmenities} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none" />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="px-10 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-base shadow-sm">
            {saving ? 'Updating...' : 'Update Room'}
          </button>
        </div>
      </form>
    </div>
  );
}
