import { tmdbClient } from '@/lib/tmdb/client';
import { MovieCard } from '@/components/movie/movie-card';
import type { TMDbSearchResponse } from '@/types/tmdb';

interface RelatedMoviesProps {
  movieId: number;
}

export async function RelatedMovies({ movieId }: RelatedMoviesProps) {
  let similarMovies: TMDbSearchResponse | null = null;
  let recommendedMovies: TMDbSearchResponse | null = null;

  try {
    // Fetch both similar and recommended movies
    [similarMovies, recommendedMovies] = await Promise.all([
      tmdbClient.getSimilarMovies(movieId),
      tmdbClient.getMovieRecommendations(movieId),
    ]);
  } catch (error) {
    console.error('Error fetching related movies:', error);
  }

  // Combine and deduplicate movies
  const allRelatedMovies = [
    ...(similarMovies?.results || []),
    ...(recommendedMovies?.results || []),
  ];

  // Remove duplicates based on movie ID
  const uniqueMovies = allRelatedMovies.filter(
    (movie, index, self) => self.findIndex((m) => m.id === movie.id) === index
  );

  // Sort by popularity and take top 12
  const sortedMovies = uniqueMovies
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12);

  if (sortedMovies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
        More Like This
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sortedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            size="sm"
            showRating={true}
            showYear={true}
            showRuntime={false}
          />
        ))}
      </div>
    </div>
  );
}
