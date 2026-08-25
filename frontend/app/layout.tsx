import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { SiteFooterChrome, SiteHeaderChrome } from '@/components/site-chrome';
import { HotelJsonLd } from '@/components/json-ld';
import { site } from '@/data/site';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://arrowbeachresort.com'),
  title: {
    default: `Arrow Beach Hotel | Beachfront Hotel in Galle near Rathgama Beach`,
    template: `%s | ${site.name}`,
  },
  description:
    'Arrow Beach Hotel is a luxury beachfront hotel in Galle, Sri Lanka near Rathgama Beach. Experience ocean view double & triple rooms, private balcony suites, serene beach stays, and authentic Sri Lankan hospitality.',
  keywords: [
    'Arrow Beach Hotel',
    'beach hotel in Galle',
    'hotel in Galle',
    'hotel near Rathgama Beach',
    'beachfront hotel in Galle',
    'Sri Lanka hotel',
    'Galle luxury resort',
    'Rathgama Beach accommodation',
    'ocean view room Galle',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `Arrow Beach Hotel | Beachfront Hotel in Galle near Rathgama Beach`,
    description:
      'Arrow Beach Hotel is a luxury beachfront hotel in Galle near Rathgama Beach, Sri Lanka. Features ocean view rooms, balcony suites, and serene beach access.',
    url: '/',
    siteName: site.name,
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 1200,
        alt: 'Arrow Beach Hotel - Beachfront Hotel in Galle',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Arrow Beach Hotel | Beachfront Hotel in Galle near Rathgama Beach`,
    description:
      'Arrow Beach Hotel is a luxury beachfront hotel in Galle near Rathgama Beach, Sri Lanka. Features ocean view rooms, balcony suites, and serene beach access.',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <HotelJsonLd />
      </head>
      <body>
        <SiteHeaderChrome />
        {children}
        <SiteFooterChrome />
      </body>
    </html>
  );
}
