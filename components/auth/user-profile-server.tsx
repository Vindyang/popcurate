'use server';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { NavUser } from '@/components/nav-user';
import Link from 'next/link';

/**
 * Server component that fetches the current session and renders NavUser or Sign in button.
 */
export default async function UserProfileServer() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="text-primary bg-muted hover:bg-accent rounded-full px-4 py-2 font-medium transition-colors"
      >
        Sign in
      </Link>
    );
  }
  return (
    <NavUser
      user={{
        name: session.user.name ?? 'User',
        email: session.user.email ?? '',
        avatar: session.user.image ?? '/avatars/user.jpg',
      }}
    />
  );
}
