import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { site } from '@/data/site';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Rooms', href: '/#rooms' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Booking', href: '/booking' },
  { label: 'Contact', href: '/#contact' },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-night text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(31,143,177,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(195,146,82,0.18),transparent_24%)]" />

      <div className="relative grid w-full gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr_0.9fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sand-200/75">Arrow Beach Hotel</p>
          <p className="mt-4 max-w-xl font-display text-4xl leading-tight text-balance sm:text-5xl">
            Luxury by the sea, designed for calm arrivals and memorable stays.
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">{site.description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sand-200 px-6 py-3.5 text-sm font-semibold text-night transition hover:bg-sand-100"
            >
              Reserve Now
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sand-200/80">Explore</p>
          <div className="mt-5 grid gap-3 text-sm text-white/75">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 transition hover:bg-white/10">
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4 text-sand-200/80" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sand-200/80">Contact</p>
          <div className="mt-5 space-y-3 text-sm text-white/78">
            <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
              <MapPin className="mt-0.5 h-4 w-4 text-sand-200" />
              <span>{site.address}</span>
            </div>
            <a href={`tel:${site.phone}`} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 transition hover:bg-white/10">
              <Phone className="h-4 w-4 text-sand-200" />
              <span>{site.phoneDisplay}</span>
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 transition hover:bg-white/10">
              <Mail className="h-4 w-4 text-sand-200" />
              <span>{site.email}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-4 py-5 text-center text-sm text-white/55 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {site.name}. Crafted for premium Sri Lanka stays.
      </div>
    </footer>
  );
}
