import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Rooms } from '@/components/rooms';
import { Facilities } from '@/components/facilities';
import { Gallery } from '@/components/gallery';
import { Testimonials } from '@/components/testimonials';
import { Attractions } from '@/components/attractions';
import { Contact } from '@/components/contact';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Rooms />
      <Facilities />
      <Gallery />
      <Testimonials />
      <Attractions />
      <Contact />
    </main>
  );
}
