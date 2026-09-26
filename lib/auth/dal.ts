import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserSession } from '@/lib/db';

const SESSION_COOKIE_NAME = 'featurepulse_session';

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value) as UserSession;
    return session;
  } catch {
    return null;
  }
}

export async function requireUserSession(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireAdminSession(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin role required');
  }
  return session;
}
