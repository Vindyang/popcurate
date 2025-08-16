'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createWatchlist } from '@/app/(public)/watchlists/action/componentactions';

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

  async function handleAdd() {
    setLoading(true);
    setError(null);
    try {
      await createWatchlist({
        name: title,
        description: '',
        movie_id: movieId,
      });
      setAdded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add to watchlist'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <Button
        variant={added ? 'secondary' : 'default'}
        disabled={loading || added}
        onClick={handleAdd}
        aria-label="Add to Watchlist"
        className="cursor-pointer"
      >
        {loading
          ? 'Adding...'
          : added
            ? 'Added to Watchlist'
            : 'Add to Watchlist'}
      </Button>
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}
