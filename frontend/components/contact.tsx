'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { site } from '@/data/site';
import { SectionHeading } from '@/components/section-heading';

export function Contact() {
  return (
    <section id="contact" className="bg-section-gradient py-24 sm:py-32">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Reach us, find us, or message us instantly."
          description="Use the map, WhatsApp, email, or phone to plan your stay or ask for room availability."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] border border-sand-200 bg-white p-7 shadow-luxury"
          >
            <div className="grid gap-5">
              <a href={`https://wa.me/${site.whatsapp}`} className="flex items-center gap-3 rounded-2xl border border-sand-200 p-4 transition hover:bg-sand-50">
                <MessageCircle className="text-ocean-800" size={20} />
                <span className="font-medium text-night">WhatsApp us for quick booking assistance</span>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 rounded-2xl border border-sand-200 p-4 transition hover:bg-sand-50">
                <Mail className="text-ocean-800" size={20} />
                <span className="font-medium text-night">{site.email}</span>
              </a>
              <a href={`tel:${site.phone}`} className="flex items-center gap-3 rounded-2xl border border-sand-200 p-4 transition hover:bg-sand-50">
                <Phone className="text-ocean-800" size={20} />
                <span className="font-medium text-night">{site.phone}</span>
              </a>
              <div className="flex items-center gap-3 rounded-2xl border border-sand-200 p-4">
                <MapPin className="text-ocean-800" size={20} />
                <span className="font-medium text-night">{site.location}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2rem] border border-sand-200 bg-white shadow-luxury"
          >
            <iframe
              title="Arrow Beach Hotel map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=15&output=embed`}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
