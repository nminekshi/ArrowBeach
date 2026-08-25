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
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon-48x48.png',
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
    url: 'https://arrowbeachresort.com',
    siteName: site.name,
    images: [
      {
        url: 'https://arrowbeachresort.com/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Arrow Beach Hotel - Luxury Beachfront Resort in Galle',
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
    images: ['https://arrowbeachresort.com/og-image.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon-48x48.png" />
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
