'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { highlights } from '@/data/site';
import { SectionHeading } from '@/components/section-heading';

const card = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
};

export function About() {
  return (
    <section id="about" className="bg-section-gradient py-24 sm:py-32">
      <div className="w-full px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} transition={{ staggerChildren: 0.12 }}>
            <SectionHeading
              eyebrow="About Us"
              title="A calm, contemporary hideaway designed for elevated stays."
              description="Arrow Beach Hotel blends coastal serenity with polished service, intimate spaces, and a design language inspired by the sea, sand, and the warmth of Sri Lanka’s south coast."
            />

            <div className="mt-8 grid gap-4">
              {highlights.map((item) => (
                <motion.div
                  key={item}
                  variants={card}
                  transition={{ duration: 0.65 }}
                  className="flex items-start gap-3 rounded-3xl border border-sand-200 bg-white/75 p-5 shadow-luxury backdrop-blur"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ocean-900 text-white">
                    <Check size={15} />
                  </span>
                  <p className="text-base leading-7 text-night/80">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] border border-white/60 shadow-luxury"
          >
            <Image
              src="/images/hero-bedroom.jpg"
              alt="Stylish hotel suite interior"
              width={1200}
              height={1400}
              className="h-[540px] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="rounded-[1.5rem] border border-white/20 bg-night/60 p-5 text-white backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.28em] text-white/65">Signature experience</p>
                <p className="mt-2 font-display text-3xl">Beachfront comfort, quiet luxury.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
