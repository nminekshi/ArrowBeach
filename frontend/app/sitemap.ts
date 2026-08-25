import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://arrowbeachresort.com';

  const routes = [
    '',
    '/booking',
    '/gallery',
    '/rooms',
    '/rooms/deluxe-beach-view-double-room',
    '/rooms/deluxe-beach-view-triple-room',
    '/rooms/standard-ac-room',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
