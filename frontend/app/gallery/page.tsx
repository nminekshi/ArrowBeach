import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { SectionHeading } from '@/components/section-heading';

function getImagesRecursively(dir: string, baseDir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getImagesRecursively(fullPath, baseDir));
    } else {
      if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
        // Convert to web path relative to 'public'
        const relative = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        results.push('/' + relative);
      }
    }
  });
  return results;
}

export default function GalleryPage() {
  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');
  
  let imageFiles: string[] = [];
  try {
    imageFiles = getImagesRecursively(imagesDir, publicDir);
  } catch (error) {
    console.error('Error reading images directory:', error);
  }

  return (
    <div className="min-h-screen bg-sand-50 pt-32 pb-24">
      <div className="w-full px-6 lg:px-8">
        <SectionHeading
          eyebrow="Full Gallery"
          title="Every corner of Arrow Beach Hotel."
          description="Explore our complete collection of images showcasing the rooms, facilities, and beautiful surroundings."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {imageFiles.map((srcPath) => {
            const filename = srcPath.split('/').pop() || '';
            return (
              <div
                key={srcPath}
                className="group relative overflow-hidden rounded-[1.8rem] shadow-luxury aspect-square sm:aspect-auto sm:h-80"
              >
                <Image
                  src={srcPath}
                  alt={filename.replace(/\.[^/.]+$/, "")}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/65 via-night/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
