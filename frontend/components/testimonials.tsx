'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { testimonials } from '@/data/site';
import { SectionHeading } from '@/components/section-heading';

export function Testimonials() {
  return (
    <section className="bg-night py-24 text-white sm:py-32">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Guests return for the view, the calm, and the service."
          description="A few words from travelers who stayed with us for a coastal escape, a family break, or a quiet luxury weekend."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
              className="rounded-[1.8rem] border border-white/10 bg-white/6 p-7 shadow-luxury backdrop-blur"
            >
              <Quote className="text-sand-200" size={24} />
              <blockquote className="mt-5 text-base leading-8 text-white/80">{item.quote}</blockquote>
              <figcaption className="mt-6">
                <p className="font-display text-2xl">{item.name}</p>
                <p className="text-sm uppercase tracking-[0.24em] text-white/55">{item.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
