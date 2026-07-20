'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageCircle, Send, CheckCircle, Loader2 } from 'lucide-react';
import { site } from '@/data/site';
import { SectionHeading } from '@/components/section-heading';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to send message');
      setStatus('success');
      setForm(initialForm);
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or contact us directly.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="bg-section-gradient py-24 sm:py-32">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Reach us, find us, or message us instantly."
          description="Use the form below to send us a message, or reach us via WhatsApp, email, or phone."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Contact Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-sand-200 bg-white p-7 shadow-luxury">
              <h3 className="font-display text-xl text-night mb-5">Get in Touch</h3>
              <div className="grid gap-4">
                <a href={`https://wa.me/${site.whatsapp}`} className="flex items-center gap-3 rounded-2xl border border-sand-200 p-4 transition hover:bg-sand-50 hover:border-ocean-200">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-50">
                    <MessageCircle className="text-ocean-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-night">WhatsApp</p>
                    <p className="text-sm text-night/60">Quick booking assistance</p>
                  </div>
                </a>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 rounded-2xl border border-sand-200 p-4 transition hover:bg-sand-50 hover:border-ocean-200">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-50">
                    <Mail className="text-ocean-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-night">{site.email}</p>
                    <p className="text-sm text-night/60">We reply within 24 hours</p>
                  </div>
                </a>
                <a href={`tel:${site.phone}`} className="flex items-center gap-3 rounded-2xl border border-sand-200 p-4 transition hover:bg-sand-50 hover:border-ocean-200">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-50">
                    <Phone className="text-ocean-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-night">{site.phone}</p>
                    <p className="text-sm text-night/60">Daily 8 AM – 10 PM</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 rounded-2xl border border-sand-200 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-50">
                    <MapPin className="text-ocean-700" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-night">{site.location}</p>
                    <p className="text-sm text-night/60">{site.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-sand-200 bg-white shadow-luxury">
              <iframe
                title="Arrow Beach Hotel map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=15&output=embed`}
                className="h-[280px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] border border-sand-200 bg-white p-7 sm:p-9 shadow-luxury"
          >
            <h3 className="font-display text-xl text-night mb-2">Send us a Message</h3>
            <p className="text-sm text-night/60 mb-6">We&apos;ll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-night/80 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-sand-200 bg-sand-50/50 px-4 py-3 text-sm text-night placeholder:text-night/30 outline-none transition focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-night/80 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-sand-200 bg-sand-50/50 px-4 py-3 text-sm text-night placeholder:text-night/30 outline-none transition focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-night/80 mb-1.5">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+94 77 XXX XXXX"
                    className="w-full rounded-xl border border-sand-200 bg-sand-50/50 px-4 py-3 text-sm text-night placeholder:text-night/30 outline-none transition focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-night/80 mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-sand-200 bg-sand-50/50 px-4 py-3 text-sm text-night outline-none transition focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100"
                  >
                    <option value="">Select a topic</option>
                    <option value="Room Availability">Room Availability</option>
                    <option value="Reservation Inquiry">Reservation Inquiry</option>
                    <option value="Airport Transfer">Airport Transfer</option>
                    <option value="Special Requests">Special Requests</option>
                    <option value="Group Booking">Group Booking</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-night/80 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you…"
                  className="w-full rounded-xl border border-sand-200 bg-sand-50/50 px-4 py-3 text-sm text-night placeholder:text-night/30 outline-none transition focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ocean-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ocean-800 disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800"
                >
                  <CheckCircle size={18} className="shrink-0" />
                  <p>Thank you! Your message has been sent. We&apos;ll get back to you shortly.</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800"
                >
                  {errorMsg}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
