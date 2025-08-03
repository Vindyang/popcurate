import { Suspense } from 'react';
import { tmdbClient } from '@/lib/tmdb/client';
import { MovieCard } from '@/components/movie/movie-card';
import { Button } from '@/components/ui/button';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface TopRatedPageProps {
  searchParams: { page?: string };
}

export default async function TopRatedPage({
  searchParams,
}: TopRatedPageProps) {
  const page = parseInt(searchParams.page || '1');
  const movies = await tmdbClient.getTopRatedMovies(page);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-lg bg-yellow-500/20 p-3">
          <TrophyIcon className="h-8 w-8 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Top Rated Movies
          </h1>
          <p className="text-muted-foreground">
            The highest-rated movies of all time
          </p>
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
  title: 'Top Rated Movies | Popcurate',
  description: 'Discover the highest-rated movies of all time.',
};
