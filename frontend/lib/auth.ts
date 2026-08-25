import { readCollection, writeCollection } from './db';
export { ADMIN_COOKIE_NAME, createSessionToken, verifySessionToken } from './tokens';

export interface AdminUser {
  username: string;
  email: string;
  password?: string;
  role: string;
}

export function getAdminUser(): AdminUser {
  try {
    const adminRecords = readCollection<AdminUser>('admin');
    if (adminRecords && adminRecords.length > 0) {
      return adminRecords[0];
    }
  } catch (err) {
    // fallback if file system read fails
  }

  return {
    username: 'admin',
    email: 'admin@arrowbeach.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
  };
}

export function updateAdminUser(updates: Partial<AdminUser>): AdminUser {
  const current = getAdminUser();
  const updated: AdminUser = {
    ...current,
    ...updates,
    role: 'admin',
  };
  writeCollection('admin', [updated]);
  return updated;
}

export function verifyAdminCredentials(usernameInput: string, passwordInput: string): boolean {
  const admin = getAdminUser();
  const expectedUsername = admin.username.toLowerCase();
  const expectedEmail = admin.email.toLowerCase();
  const inputLower = usernameInput.trim().toLowerCase();

  const isUsernameMatch = inputLower === expectedUsername || inputLower === expectedEmail;
  const isPasswordMatch = passwordInput === admin.password;

  return isUsernameMatch && isPasswordMatch;
}
