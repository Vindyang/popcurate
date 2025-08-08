import { Suspense } from 'react';
import { tmdbClient } from '@/lib/tmdb/client';
import { MovieCard } from '@/components/movie/movie-card';
import { Button } from '@/components/ui/button';
import { FireIcon } from '@heroicons/react/24/outline';

interface TrendingPageProps {
  searchParams: Promise<{ page?: string; time_window?: string }>;
}

export default async function TrendingPage({
  searchParams,
}: TrendingPageProps) {
  const { page: pageParam, time_window } = await searchParams;
  const page = parseInt(pageParam || '1');
  const timeWindow = (time_window || 'week') as 'day' | 'week';

  const movies = await tmdbClient.getTrendingMovies(timeWindow, page);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-muted rounded-lg p-3">
          <FireIcon className="text-foreground h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trending Movies</h1>
          <p className="text-muted-foreground">
            The most popular movies{' '}
            {timeWindow === 'day' ? 'today' : 'this week'}
          </p>
        </div>
      </div>

      {/* Time Window Toggle */}
      <div className="mb-8 flex gap-2">
        <Button
          variant={timeWindow === 'week' ? 'default' : 'outline'}
          asChild
          className={
            timeWindow === 'week'
              ? 'border border-gray-300 bg-white text-black shadow-sm transition-colors duration-150'
              : ''
          }
        >
          <a href="?time_window=week">This Week</a>
        </Button>
        <Button
          variant={timeWindow === 'day' ? 'default' : 'outline'}
          asChild
          className={
            timeWindow === 'day'
              ? 'border border-gray-300 bg-white text-black shadow-sm transition-colors duration-150'
              : ''
          }
        >
          <a href="?time_window=day">Today</a>
        </Button>
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
              <a href={`?page=${page - 1}&time_window=${timeWindow}`}>
                Previous
              </a>
            </Button>
          )}

          <span className="flex items-center px-4 py-2 text-sm">
            Page {page} of {movies.total_pages}
          </span>

          {page < movies.total_pages && (
            <Button variant="outline" asChild>
              <a href={`?page=${page + 1}&time_window=${timeWindow}`}>Next</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: 'Trending Movies | Popcurate',
  description: 'Discover the most popular movies trending right now.',
};
