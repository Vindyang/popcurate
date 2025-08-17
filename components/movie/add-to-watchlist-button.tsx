'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  createWatchlist,
  isMovieInWatchlist,
  removeWatchlist,
} from '@/app/(public)/watchlists/action/componentactions';

interface AddToWatchlistButtonProps {
  movieId: number;
  title: string;
}

export function AddToWatchlistButton({
  movieId,
  title,
}: AddToWatchlistButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function checkAlreadyAdded() {
      try {
        const alreadyAdded = await isMovieInWatchlist(movieId);
        if (mounted && alreadyAdded) {
          setAdded(true);
        }
      } catch {
        // ignore error, assume not added
      }
    }
    checkAlreadyAdded();
    return () => {
      mounted = false;
    };
  }, [movieId]);

  async function handleAction() {
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
    <div className="mt-6">
      <Button
        disabled={loading}
        onClick={handleAction}
        aria-label={added ? 'Remove from Watchlist' : 'Add to Watchlist'}
        className="cursor-pointer"
      >
        {loading
          ? added
            ? 'Removing...'
            : 'Adding...'
          : added
            ? 'Remove from Watchlist'
            : 'Add to Watchlist'}
      </Button>
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}
