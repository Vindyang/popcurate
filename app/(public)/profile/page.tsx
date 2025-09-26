'use client';
import { useRouter } from 'next/navigation';
import { UserProfileForm } from './components/user-profile-form';
import { authClient } from '@/lib/betterauth/auth-client';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // If not authenticated, redirect to sign in page (similar to nav-user pattern)
  if (!session?.user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto max-w-xl py-8">
      <UserProfileForm initialName="" initialImage="" />
    </div>
  );
}
