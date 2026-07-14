'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, X } from 'lucide-react';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState({ src: '', alt: '' });
  const [saving, setSaving] = useState(false);

  const fetchGallery = () => {
    fetch('/api/gallery').then(r => r.json()).then(data => {
      setImages(data.gallery || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchGallery(); }, []);

  const addImage = async () => {
    if (!newImage.src) return;
    setSaving(true);
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newImage),
    });
    setNewImage({ src: '', alt: '' });
    setShowModal(false);
    setSaving(false);
    fetchGallery();
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    fetchGallery();
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
          <h1 className="text-3xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-600 mt-1 text-base">Manage your hotel photos. {images.length} image{images.length !== 1 ? 's' : ''}.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-base shadow-sm">
          <Plus size={20} />
          Add Image
        </button>
      </div>

      {images.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
          No gallery images yet. Click &quot;Add Image&quot; to upload.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img: any) => (
            <div key={img.id} className="relative group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm aspect-[4/3]">
              <Image src={img.src} alt={img.alt || 'Gallery image'} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => deleteImage(img.id)} className="p-2 bg-white/90 rounded-lg text-red-600 hover:bg-white transition shadow">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                <p className="text-white text-xs truncate">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Add Gallery Image</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={newImage.src}
                  onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="/images/gallery/photo.jpg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Alt Text (description)</label>
                <input
                  type="text"
                  value={newImage.alt}
                  onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Hotel pool at sunset"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
              <button onClick={addImage} disabled={saving || !newImage.src} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {saving ? 'Adding...' : 'Add Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
