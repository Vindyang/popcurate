// app/(public)/watchlists/components/watchlists.tsx

'use client';

import { useState, useEffect } from 'react';
import { fetchWatchlists } from '@/app/(public)/watchlists/action/componentactions';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export function Watchlists() {
  // Use a plain type for Watchlist to avoid import errors
  type Watchlist = {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadWatchlists() {
      try {
        setLoading(true);
        const data = await fetchWatchlists();
        if (isMounted)
          setWatchlists(
            (data ?? []).map((wl) => ({
              ...wl,
              created_at: wl.created_at ? wl.created_at.toString() : '',
              updated_at: wl.updated_at ? wl.updated_at.toString() : '',
            }))
          );
      } catch (err) {
        if (isMounted)
          setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadWatchlists();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Spinner />;
  if (!loading && (!watchlists || watchlists.length === 0))
    return (
      <div className="text-muted-foreground py-8 text-center">
        Your watchlist is empty.
        <br />
        Start exploring movies and add your favorites to curate your personal
        collection.
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid gap-6">
      {watchlists.map((wl) => (
        <Card key={wl.id} className="p-4">
          <h2 className="text-xl font-semibold">{wl.name}</h2>
          <p className="text-muted-foreground text-sm">{wl.description}</p>
        </Card>
      ))}
    </div>
  );
}
