import path from 'path';
import fs from 'fs';
import Image from 'next/image';
import { SectionHeading } from '@/components/section-heading';

function readGalleryFromDb(): { id: string; src: string; alt: string }[] {
  const dbPath = path.join(process.cwd(), 'data', 'db', 'gallery.json');
  if (!fs.existsSync(dbPath)) return [];
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function GalleryPage() {
  const images = readGalleryFromDb();

  return (
    <div className="min-h-screen bg-sand-50 pt-32 pb-24">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Full Gallery"
          title="Every corner of Arrow Beach Hotel."
          description="Explore our complete collection of images showcasing the rooms, facilities, and beautiful surroundings."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id || img.src}
              className="group relative overflow-hidden rounded-[1.8rem] shadow-luxury aspect-square sm:aspect-auto sm:h-80"
            >
              <Image
                src={img.src}
                alt={img.alt || img.src.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Gallery image'}
                width={800}
                height={800}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/65 via-night/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
