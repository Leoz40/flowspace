import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { AstroCookies } from 'astro';

const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@flowspace.com',
    password: '$2a$10$XQ5rbzrKzHJzEXAMPLEHASH',
    name: 'Vistoriador Demo',
  },
];
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

export async function validateUser(email: string, password: string) {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password); // Demo bcrypt hash. Replace with a properly generated hash during user signup.
  return isValid ? { id: user.id, email: user.email, name: user.name } : null;
}

export async function setAuthCookie(cookies: AstroCookies, userId: string) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  sessions.set(sessionId, { userId, expiresAt });
  cookies.set('auth_session', sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function validateSession(sessionId: string) {
  const session = sessions.get(sessionId);
  return session && session.expiresAt > new Date() ? session : null;
}
