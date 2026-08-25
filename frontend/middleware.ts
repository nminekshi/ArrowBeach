import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/tokens';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run middleware on /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === '/admin/login';
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = Boolean(session && session.role === 'admin');

  // If user is accessing /admin/login while already authenticated, redirect to /admin
  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // If user is accessing protected /admin routes without authentication, redirect to /admin/login
  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', req.url);
    if (pathname !== '/admin') {
      loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
