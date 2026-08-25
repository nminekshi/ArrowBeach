import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
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
          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-sand-200/40 bg-white p-0.5 shadow-glow">
              <Image src="/images/logo-icon.png" alt="Arrow Beach Resort Logo" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sand-200/90">Arrow Beach Resort</p>
              <p className="text-[10px] text-white/50 tracking-wider">Galle • Sri Lanka</p>
            </div>
          </div>

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
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
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
