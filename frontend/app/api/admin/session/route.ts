import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken, getAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = await verifySessionToken(token);
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const admin = getAdminUser();
  return NextResponse.json({
    authenticated: true,
    user: {
      username: admin.username,
      email: admin.email,
      role: 'admin',
    },
  });
}
