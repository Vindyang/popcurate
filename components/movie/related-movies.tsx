import { tmdbClient } from '@/lib/tmdb/client';
import { MovieCard } from '@/components/movie/movie-card';
import type { TMDbSearchResponse, TMDbMovieDetails } from '@/types/tmdb';

interface RelatedMoviesProps {
  movie: TMDbMovieDetails;
}

export async function RelatedMovies({ movie }: RelatedMoviesProps) {
  let similarMovies: TMDbSearchResponse | null = null;
  let recommendedMovies: TMDbSearchResponse | null = null;
  let genreBasedMovies: TMDbSearchResponse | null = null;

  try {
    // Get the genre IDs from the current movie
    const genreIds = movie.genres.map((genre) => genre.id).join(',');

    // Fetch genre-based movies, similar movies, and recommended movies
    [genreBasedMovies, similarMovies, recommendedMovies] = await Promise.all([
      // Discover movies with the same genres, excluding the current movie
      genreIds
        ? tmdbClient.discoverMovies({
            genre: genreIds,
            sortBy: 'popularity.desc',
            page: 1,
          })
        : Promise.resolve(null),
      tmdbClient.getSimilarMovies(movie.id),
      tmdbClient.getMovieRecommendations(movie.id),
    ]);
  } catch (error) {
    console.error('Error fetching related movies:', error);
  }

  // Combine movies from all sources
  const allRelatedMovies = [
    ...(genreBasedMovies?.results || []),
    ...(similarMovies?.results || []),
    ...(recommendedMovies?.results || []),
  ];

  // Remove duplicates based on movie ID and exclude the current movie
  const uniqueMovies = allRelatedMovies.filter(
    (relatedMovie, index, self) =>
      relatedMovie.id !== movie.id && // Exclude current movie
      self.findIndex((m) => m.id === relatedMovie.id) === index
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
        {sortedMovies.map((relatedMovie) => (
          <MovieCard
            key={relatedMovie.id}
            movie={relatedMovie}
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
