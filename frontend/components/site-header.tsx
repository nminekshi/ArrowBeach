'use client';

import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { site } from '@/data/site';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Rooms', href: '/#rooms' },
  { label: 'Facilities', href: '/#facilities' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Contact', href: '/#contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isBookingPage = pathname.startsWith('/booking');

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
      <div className="w-full overflow-hidden rounded-[1.75rem] border border-white/20 bg-night/45 backdrop-blur-2xl shadow-luxury">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/12">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-sand-200 text-night shadow-glow transition group-hover:scale-105">A</span>
            <span className="hidden sm:block">
              <span className="block font-display text-lg leading-none">{site.name}</span>
              <span className="block text-[10px] uppercase tracking-[0.26em] text-white/55">Beachfront Luxury</span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 xl:flex">
            <div className="rounded-full border border-white/10 bg-white/8 px-2 py-2 backdrop-blur-xl">
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href.replace('/#', '/'));

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-medium transition',
                        active ? 'bg-white text-night shadow-sm' : 'text-white/75 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <Link
              href="/booking"
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
                isBookingPage ? 'bg-sand-100 text-night' : 'bg-sand-200 text-night hover:bg-sand-100',
              )}
            >
              Book Stay
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <Link
              href="/booking"
              className="rounded-full bg-sand-200 px-4 py-2.5 text-sm font-semibold text-night shadow-sm"
            >
              Book
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white backdrop-blur-xl"
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            'border-t border-white/10 px-4 pb-4 pt-3 sm:px-6 lg:px-8 xl:hidden',
            open ? 'block' : 'hidden',
          )}
        >
          <nav className="grid gap-2 sm:grid-cols-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/12"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/booking"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sand-200 px-4 py-3 text-sm font-semibold text-night"
          >
            Book Your Stay
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
