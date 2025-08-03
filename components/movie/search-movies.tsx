'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/movie/movie-card';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { TMDbMovie } from '@/types/tmdb';

interface SearchMoviesProps {
  className?: string;
}

export function SearchMovies({ className }: SearchMoviesProps) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<TMDbMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call our API route instead of direct TMDB client
      // This follows Next.js best practices for client-side data fetching
      const response = await fetch(
        `/api/movies/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search movies');
      }

      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies(query);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <MagnifyingGlassIcon className="h-4 w-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && (
        <div className="bg-muted text-foreground mb-4 rounded-lg border p-4">
          {error}
        </div>
      )}

      {movies.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!isLoading && !error && movies.length === 0 && query && (
        <p className="text-muted-foreground text-center">
          No movies found for &ldquo;{query}&rdquo;. Try a different search
          term.
        </p>
      )}
    </div>
  );
}
