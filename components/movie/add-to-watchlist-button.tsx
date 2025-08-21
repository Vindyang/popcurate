'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/betterauth/auth-client';
import {
  createWatchlist,
  removeWatchlist,
} from '@/app/(public)/watchlists/action/componentactions';

interface AddToWatchlistButtonProps {
  movieId: number;
  title: string;
  initialAdded?: boolean;
}

export function AddToWatchlistButton({
  movieId,
  title,
  initialAdded = false,
}: AddToWatchlistButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(initialAdded);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function handleAction() {
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (added) {
        await removeWatchlist(movieId);
        setAdded(false);
        toast.success('Removed from watchlist');
      } else {
        await createWatchlist({
          name: title,
          description: '',
          movie_id: movieId,
        });
        setAdded(true);
        toast.success('Added to watchlist');
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update watchlist';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center sm:items-start">
      <Button
        disabled={loading}
        onClick={handleAction}
        aria-label={added ? 'Remove from Watchlist' : 'Add to Watchlist'}
        className="w-full max-w-xs cursor-pointer py-3 text-base sm:w-auto sm:max-w-none sm:text-sm"
      >
        {loading
          ? added
            ? 'Removing...'
            : 'Adding...'
          : added
            ? 'Remove from Watchlist'
            : 'Add to Watchlist'}
      </Button>
      {error && (
        <div className="mt-2 w-full max-w-xs text-center text-sm text-red-500 sm:w-auto sm:max-w-none sm:text-left">
          {error}
        </div>
      )}
    </div>
  );
}
