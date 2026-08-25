'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.rooms) {
          const found = data.rooms.find((r: any) => slugify(r.name) === resolvedParams.slug);
          setRoom(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (activeImageIndex === null || !room) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImageIndex(null);
      if (event.key === 'ArrowLeft') showPreviousImage();
      if (event.key === 'ArrowRight') showNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImageIndex, room]);

  if (loading) {
    return <div className="min-h-screen bg-sand-50 flex items-center justify-center pt-32 pb-24"><div className="w-8 h-8 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!room) {
    notFound();
  }

  const showPreviousImage = () => {
    setActiveImageIndex((current) => current !== null ? (current - 1 + room.images.length) % room.images.length : null);
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => current !== null ? (current + 1) % room.images.length : null);
  };

  return (
    <div className="min-h-screen bg-sand-50 pt-32 pb-24">
      <div className="w-full px-6 lg:px-12">
        <Link href="/#rooms" className="inline-flex items-center text-sm font-medium text-ocean-700 hover:text-ocean-900 transition mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all rooms
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ocean-700/65">{room.subtitle}</p>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-night">{room.name}</h1>
            <p className="mt-6 text-lg leading-8 text-night/70">{room.description}</p>

            <div className="mt-10">
              <h3 className="text-xl font-semibold text-night mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3 text-night/75">
                {(room.fullAmenities || room.amenities).map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <BadgeCheck size={18} className="text-ocean-700" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-[2rem] bg-white p-8 shadow-luxury border border-sand-200">
              <p className="text-xs uppercase tracking-[0.24em] text-night/45">Starting from</p>
              <p className="mt-2 font-display text-4xl text-night">{room.price}</p>
              <p className="mt-2 text-ocean-800">{room.breakfast}</p>

              <Link
                href={`/booking?room=${encodeURIComponent(room.type)}`}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ocean-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-ocean-800"
              >
                Book This Room
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => setActiveImageIndex(0)}
              className="relative block h-96 sm:h-[32rem] w-full overflow-hidden rounded-[2rem] shadow-luxury text-left"
              aria-label="View photo full screen"
            >
              <Image src={room.images[0]} alt={room.name} fill className="object-cover transition duration-700 hover:scale-105" priority />
            </button>

            {room.images && room.images.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {room.images.slice(1, 7).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx + 1)}
                    className="relative block h-32 sm:h-40 w-full overflow-hidden rounded-2xl shadow-sm text-left"
                    aria-label={`View photo ${idx + 2} full screen`}
                  >
                    <Image src={img} alt={`${room.name} view ${idx + 2}`} fill className="object-cover transition duration-700 hover:scale-105" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/90 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-6" onClick={() => setActiveImageIndex(null)} role="dialog" aria-modal="true">
          <div className="relative flex w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-transparent shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="absolute right-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
              aria-label="Close photo gallery"
            >
              <X size={18} />
            </button>

            <div className="relative h-[80vh] w-full flex items-center justify-center">
              <Image
                src={room.images[activeImageIndex]}
                alt={`${room.name} photo ${activeImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />

              {room.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); showPreviousImage(); }}
                    className="absolute left-4 top-1/2 z-50 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); showNextImage(); }}
                    className="absolute right-4 top-1/2 z-50 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
              {activeImageIndex + 1} / {room.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
