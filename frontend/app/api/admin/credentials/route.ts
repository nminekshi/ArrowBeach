import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser, updateAdminUser, verifyAdminCredentials, ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdminUser();
  return NextResponse.json({
    success: true,
    admin: {
      username: admin.username,
      email: admin.email,
    },
  });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { username, email, currentPassword, newPassword } = await req.json();

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is required to save changes.' },
        { status: 400 }
      );
    }

    const currentAdmin = getAdminUser();
    const isValidPassword = verifyAdminCredentials(currentAdmin.username, currentPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    const updates: Record<string, string> = {};
    if (username && username.trim()) updates.username = username.trim();
    if (email && email.trim()) updates.email = email.trim();
    if (newPassword && newPassword.trim()) updates.password = newPassword.trim();

    const updated = updateAdminUser(updates);

    return NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully.',
      admin: { username: updated.username, email: updated.email },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to update admin credentials.' },
      { status: 500 }
    );
  }
}
