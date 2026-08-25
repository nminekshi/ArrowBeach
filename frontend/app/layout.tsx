import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { SiteFooterChrome, SiteHeaderChrome } from '@/components/site-chrome';
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
  metadataBase: new URL('https://arrowbeachhotel.com'),
  title: {
    default: `${site.name} | Luxury Beach Hotel in Sri Lanka`,
    template: `%s | ${site.name}`,
  },
  description:
    'Arrow Beach Hotel is a premium beachfront hotel in Sri Lanka with luxury rooms, elegant facilities, a booking form, and a modern coastal design.',
  keywords: ['Arrow Beach Hotel', 'Sri Lanka hotel', 'beach hotel', 'luxury resort', 'Galle', 'ocean view room'],
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
    title: `${site.name} | Luxury Beach Hotel in Sri Lanka`,
    description:
      'A luxury beachfront stay in Galle with elegant rooms, a serene atmosphere, and smooth booking.',
    url: '/',
    siteName: site.name,
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 1200,
        alt: site.name,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Luxury Beach Hotel in Sri Lanka`,
    description:
      'A luxury beachfront stay in Galle with elegant rooms, a serene atmosphere, and smooth booking.',
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
      </head>
      <body>
        <SiteHeaderChrome />
        {children}
        <SiteFooterChrome />
      </body>
    </html>
  );
}
