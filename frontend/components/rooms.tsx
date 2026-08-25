'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { rateGuide } from '@/data/site';
import { SectionHeading } from '@/components/section-heading';

export function Rooms() {
  const [activeRoomIndex, setActiveRoomIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [featuredRooms, setFeaturedRooms] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.rooms) {
          setFeaturedRooms(data.rooms);
        }
      })
      .catch(console.error);
  }, []);

  const activeRoom = activeRoomIndex === null ? null : featuredRooms[activeRoomIndex];

  useEffect(() => {
    if (activeRoomIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveRoomIndex(null);
      }

      if (event.key === 'ArrowLeft' && activeRoom) {
        setActiveImageIndex((current) => (current - 1 + activeRoom.images.length) % activeRoom.images.length);
      }

      if (event.key === 'ArrowRight' && activeRoom) {
        setActiveImageIndex((current) => (current + 1) % activeRoom.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRoom, activeRoomIndex]);

  const openGallery = (index: number) => {
    setActiveRoomIndex(index);
    setActiveImageIndex(0);
  };

  const closeGallery = () => {
    setActiveRoomIndex(null);
    setActiveImageIndex(0);
  };

  const showPreviousImage = () => {
    if (!activeRoom) return;
    setActiveImageIndex((current) => (current - 1 + activeRoom.images.length) % activeRoom.images.length);
  };

  const showNextImage = () => {
    if (!activeRoom) return;
    setActiveImageIndex((current) => (current + 1) % activeRoom.images.length);
  };

  return (
    <section id="rooms" className="py-24 sm:py-32">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Rooms"
          title="Signature rooms with a premium coastal feel."
          description="Each room is designed for comfort, privacy, and a relaxed luxury aesthetic. The featured stays below are paired with the brochure rates used in the attached material."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {featuredRooms.map((room, index) => (
            <motion.article
              key={room.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-sand-200 bg-white shadow-luxury"
            >
              <button
                type="button"
                onClick={() => openGallery(index)}
                className="relative h-72 w-full overflow-hidden text-left"
                aria-label={`Open photo gallery for ${room.name}`}
              >
                <Image src={room.image} alt={room.name} fill className="object-cover transition duration-700 hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-5 py-3 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100" />
              </button>
              <div className="p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ocean-700/65">{room.subtitle}</p>
                <h3 className="mt-3 font-display text-3xl text-night">{room.name}</h3>
                <p className="mt-4 text-sm leading-7 text-night/70">{room.description}</p>
                <div className="mt-5 grid gap-2 text-sm text-night/75">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <BadgeCheck size={16} className="text-ocean-700" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[1.4rem] bg-sand-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-night/45">Rates</p>
                  <p className="mt-2 font-display text-4xl font-bold text-night">{room.price}</p>
                  <p className="mt-1 text-sm font-semibold text-ocean-800">{room.breakfast}</p>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/rooms/${room.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`}
                    className="inline-flex w-full items-center justify-center rounded-full border border-ocean-900 px-5 py-4 text-sm font-semibold text-ocean-900 transition hover:bg-ocean-50"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/booking?room=${encodeURIComponent(room.type)}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-ocean-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-ocean-800"
                  >
                    Book This Room
                    <ArrowRight className="ml-2 sm:hidden lg:block" size={18} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>

      {activeRoom ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-6" onClick={closeGallery} role="dialog" aria-modal="true" aria-label={`${activeRoom.name} photo gallery`}>
          <div className="relative flex w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeGallery}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-night shadow-md transition hover:bg-white"
              aria-label="Close photo gallery"
            >
              <X size={18} />
            </button>

            <div className="relative h-[72vh] w-full bg-sand-50 sm:h-[78vh]">
              <Image
                src={activeRoom.images[activeImageIndex]}
                alt={`${activeRoom.name} photo ${activeImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />

              {activeRoom.images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-night shadow-md transition hover:bg-white"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-night shadow-md transition hover:bg-white"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-sand-200 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ocean-700/65">Room Gallery</p>
                <h3 className="mt-1 font-display text-2xl text-night">{activeRoom.name}</h3>
              </div>
              <p className="text-sm text-night/60">
                {activeImageIndex + 1} / {activeRoom.images.length}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
