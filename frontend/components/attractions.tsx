'use client';

import { motion } from 'framer-motion';
import { attractions } from '@/data/site';
import { SectionHeading } from '@/components/section-heading';

export function Attractions() {
  return (
    <section className="py-24 sm:py-32">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nearby Attractions"
          title="Explore Galle and Pitiwella Beach from Arrow Beach Hotel."
          description="Located right near Pitiwella Beach, Arrow Beach Hotel offers easy access to historic Galle Fort, pristine Southern Sri Lanka beaches, peace pagodas, and coastal wildlife."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {attractions.map((place, index) => (
            <motion.article
              key={place.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="rounded-[1.7rem] border border-sand-200 bg-white p-6 shadow-luxury"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ocean-700/60">{place.distance}</p>
              <h3 className="mt-3 font-display text-2xl text-night">{place.name}</h3>
              <p className="mt-4 text-sm leading-7 text-night/70">{place.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
