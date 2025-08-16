// app/(public)/watchlists/components/watchlists.tsx

'use client';

import { useState, useEffect } from 'react';
import { fetchWatchlists } from '@/app/(public)/watchlists/action/componentactions';
import { Spinner } from '@/components/ui/spinner';
import { MovieCard } from '@/components/movie/movie-card';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [movies, setMovies] = useState<
    (import('@/types/app').Movie | import('@/types/tmdb').TMDbMovie)[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadWatchlistsAndMovies() {
      try {
        setLoading(true);
        const data = await fetchWatchlists();
        if (isMounted) {
          setWatchlists(
            (data ?? []).map((wl) => ({
              ...wl,
              created_at: wl.created_at ? wl.created_at.toString() : '',
              updated_at: wl.updated_at ? wl.updated_at.toString() : '',
            }))
          );
          // Fetch movie details for each movie_id
          const movieIds = (data ?? []).map((wl) => wl.movie_id);
          const moviesFetched = await Promise.all(
            movieIds.map(async (id) => {
              try {
                const res = await fetch(`/api/movies/${id}`);
                if (!res.ok) return null;
                return await res.json();
              } catch {
                return null;
              }
            })
          );
          setMovies(moviesFetched.filter(Boolean));
        }
      } catch (err) {
        if (isMounted)
          setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadWatchlistsAndMovies();
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {movies.length > 0
        ? movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              size="sm"
              showRating={true}
              showYear={true}
            />
          ))
        : // Fallback placeholders if no movies or error
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
    </div>
  );
}
