import { Suspense } from 'react';
import { tmdbClient } from '@/lib/tmdb/client';
import { MovieCard } from '@/components/movie/movie-card';
import { Button } from '@/components/ui/button';
import { FilmIcon } from '@heroicons/react/24/outline';

interface NowPlayingPageProps {
  searchParams: { page?: string };
}

export default async function NowPlayingPage({
  searchParams,
}: NowPlayingPageProps) {
  const page = parseInt(searchParams.page || '1');
  const movies = await tmdbClient.getNowPlayingMovies(page);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-lg bg-green-500/20 p-3">
          <FilmIcon className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Now Playing</h1>
          <p className="text-muted-foreground">Movies currently in theaters</p>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          Showing {movies.results.length} of{' '}
          {movies.total_results.toLocaleString()} movies
        </p>
      </div>

      {/* Movies Grid */}
      <Suspense fallback={<div>Loading movies...</div>}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              showRating={true}
              showYear={true}
              size="md"
            />
          ))}
        </div>
      </Suspense>

      {/* Pagination */}
      {movies.total_pages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" asChild>
              <a href={`?page=${page - 1}`}>Previous</a>
            </Button>
          )}

          <span className="flex items-center px-4 py-2 text-sm">
            Page {page} of {movies.total_pages}
          </span>

          {page < movies.total_pages && (
            <Button variant="outline" asChild>
              <a href={`?page=${page + 1}`}>Next</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: 'Now Playing | Popcurate',
  description: 'Discover movies currently playing in theaters.',
};
