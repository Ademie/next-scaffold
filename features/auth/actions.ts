'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ActionResponse } from '../feedback/actions';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  redirect: z.string().optional(),
});

export async function signInAction(
  _prevState: ActionResponse<{ redirectTo: string }> | null,
  formData: FormData
): Promise<ActionResponse<{ redirectTo: string }>> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: formData.get('redirect'),
  };

  const validated = signInSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // Create session object
  const sessionData = {
    userId: 'user-admin-1',
    name: 'John Carter',
    email: validated.data.email,
    role: 'ADMIN' as const,
    organizationName: 'Acme Inc.',
  };

  const cookieStore = await cookies();
  cookieStore.set('featurepulse_session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  const target = validated.data.redirect || '/dashboard';
  redirect(target);
}

export async function signOutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('featurepulse_session');
  redirect('/login');
}
