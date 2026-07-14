'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export function SiteHeaderChrome() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    return null;
  }

  return <SiteHeader />;
}

export function SiteFooterChrome() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    return null;
  }

  return <SiteFooter />;
}

export function SiteChrome() {
  return (
    <>
      <SiteHeaderChrome />
      <SiteFooterChrome />
    </>
  );
}