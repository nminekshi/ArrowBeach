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
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
        width: 1600,
        height: 900,
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
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteHeaderChrome />
        {children}
        <SiteFooterChrome />
      </body>
    </html>
  );
}
