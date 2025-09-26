'use client';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Watchlists } from './components/watchlists';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { authClient } from '@/lib/betterauth/auth-client';

export default function WatchlistsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // If not authenticated, redirect to sign in page (similar to nav-user pattern)
  if (!session?.user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4">
        {/* Back Button */}
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 cursor-pointer border border-gray-300"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      <h1 className="mb-6 text-3xl font-bold">Your Watchlists</h1>
      <Suspense fallback={<div>Loading watchlists...</div>}>
        <Watchlists />
      </Suspense>
    </main>
  );
}
