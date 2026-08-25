import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/favicon.ico',
          '/favicon-48x48.png',
          '/favicon-96x96.png',
          '/apple-touch-icon.png',
          '/android-chrome-192x192.png',
          '/android-chrome-512x512.png',
          '/icon.png',
          '/site.webmanifest',
          '/images/*',
        ],
        disallow: ['/admin/', '/admin', '/api/'],
      },
    ],
    sitemap: 'https://arrowbeachresort.com/sitemap.xml',
  };
}
