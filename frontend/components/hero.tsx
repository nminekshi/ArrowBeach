'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { heroStats, site } from '@/data/site';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-night text-white">
      <Image
        src="/images/hero-suite.jpg"
        alt="Arrow Beach Hotel hero view of the ocean"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-sand-50 via-sand-50/60 to-transparent" />

      <div className="relative flex min-h-screen w-full flex-col justify-end px-6 pb-20 pt-32 lg:px-8 lg:pb-28">
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
          className="w-full"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur-md"
          >
            <Star size={14} className="text-sand-200" />
            Premium beach stay in {site.location}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl leading-[0.95] text-balance sm:text-6xl lg:text-8xl"
          >
            Modern luxury meets the calm of the Indian Ocean.
          </motion.h1>

          <motion.h2 variants={fadeUp} transition={{ duration: 0.75 }} className="mt-6 w-full text-lg leading-8 text-white/82 sm:text-xl">
            Arrow Beach Hotel is a refined coastal retreat with elegant rooms, thoughtful hospitality, and a front-row seat to Sri Lanka’s southern shoreline.
          </motion.h2>

          <motion.div variants={fadeUp} transition={{ duration: 0.75 }} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-full bg-sand-200 px-7 py-4 text-sm font-semibold text-night transition hover:bg-sand-100"
            >
              Book Your Stay
              <ArrowRight className="ml-2" size={18} />
            </Link>
            <a
              href="#rooms"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/8 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/12"
            >
              Explore Rooms
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16 grid gap-4 rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur-xl sm:grid-cols-3"
        >
          {heroStats.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">{item.label}</p>
              <p className="mt-2 font-display text-3xl text-sand-100">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
