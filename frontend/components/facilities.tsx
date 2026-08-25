'use client';

import { motion } from 'framer-motion';
import { facilities } from '@/data/site';
import { SectionHeading } from '@/components/section-heading';

export function Facilities() {
  return (
    <section id="facilities" className="bg-section-gradient py-24 sm:py-32">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Facilities"
          title="Resort amenities at Arrow Beach Hotel in Galle."
          description="A thoughtful collection of resort essentials at Arrow Beach Hotel near Pitiwella Beach, designed around comfort, ease, and a luxury beachside stay."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="rounded-[1.7rem] border border-sand-200 bg-white/85 p-6 shadow-luxury backdrop-blur"
            >
              <facility.Icon size={22} className="text-ocean-800" />
              <p className="mt-4 font-display text-2xl text-night">{facility.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
