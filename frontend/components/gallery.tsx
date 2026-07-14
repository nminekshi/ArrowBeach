'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { galleryImages } from '@/data/site';
import { SectionHeading } from '@/components/section-heading';

export function Gallery() {
  return (
    <section id="gallery" className="py-24 sm:py-32">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments shaped by light, sea air, and refined spaces."
          description="A visual preview of the calm atmosphere, shoreline setting, and elegant interiors that define the hotel experience."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.04 }}
              className="group relative overflow-hidden rounded-[1.8rem] shadow-luxury"
            >
              <Image src={image.src} alt={image.alt} width={1200} height={900} className="h-80 w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/65 via-night/12 to-transparent" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/gallery"
            className="group inline-flex items-center justify-center rounded-full border border-night/20 px-8 py-4 text-sm font-semibold text-night transition hover:bg-night/5"
          >
            View More Pictures
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
