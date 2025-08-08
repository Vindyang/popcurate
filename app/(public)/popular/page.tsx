import { Skeleton } from '@/components/ui/skeleton';
import { MovieCard } from '@/components/movie/movie-card';
import { tmdbClient } from '@/lib/tmdb/client';
import type { TMDbMovie } from '@/types/tmdb';

export default async function PopularPage() {
  let movies: TMDbMovie[] = [];

  try {
    const response = await tmdbClient.getPopularMovies(1);
    movies = response.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Popular Movies
        </h1>
        <p className="text-muted-foreground">
          The most popular movies right now across all platforms
        </p>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.length > 0
          ? movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                size="md"
                showRating={true}
                showYear={true}
              />
            ))
          : // Fallback placeholders if no movies or error
            Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3]" />
            ))}
      </div>

      {/* Pagination could be added here in the future */}
    </div>
  );
}
