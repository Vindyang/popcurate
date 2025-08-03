import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarFilledIcon } from '@heroicons/react/24/solid';
import {
  getImageUrl,
  formatRating,
  formatRuntime,
  // formatDate,
  generateMovieSlug,
} from '@/lib/utils';
import type { Movie } from '@/types/app';
import type { TMDbMovie } from '@/types/tmdb';

interface MovieCardProps {
  movie: Movie | TMDbMovie;
  showRating?: boolean;
  showYear?: boolean;
  showRuntime?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function MovieCard({
  movie,
  showRating = true,
  showYear = true,
  showRuntime = false,
  size = 'md',
}: MovieCardProps) {
  // Handle both Movie and TMDbMovie types
  const movieId = 'tmdb_id' in movie ? movie.tmdb_id : movie.id;
  const releaseDate = movie.release_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const runtime = 'runtime' in movie ? movie.runtime : null;

  const slug = generateMovieSlug(movie.title, year || 2024, movieId);

  const sizeClasses = {
    sm: 'w-32',
    md: 'w-40',
    lg: 'w-48',
  };

  return (
    <Link href={`/movie/${slug}`} className="group block">
      <div
        className={`${sizeClasses[size]} transition-transform group-hover:scale-105`}
      >
        {/* Movie Poster */}
        <div className="bg-muted relative mb-3 aspect-[2/3] overflow-hidden rounded-lg shadow-sm">
          {movie.poster_path ? (
            <Image
              src={getImageUrl(
                movie.poster_path,
                size === 'lg' ? 'w500' : 'w200'
              )}
              alt={movie.title}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
              sizes="(max-width: 768px) 160px, (max-width: 1200px) 200px, 240px"
            />
          ) : (
            <div className="bg-muted flex h-full items-center justify-center">
              <span className="text-muted-foreground text-4xl">🎬</span>
            </div>
          )}

          {/* Rating Badge */}
          {showRating && movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <StarFilledIcon className="h-3 w-3 text-yellow-400" />
              <span>{formatRating(movie.vote_average)}</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="space-y-1">
          <h3 className="group-hover:text-primary line-clamp-2 text-sm font-medium transition-colors">
            {movie.title}
          </h3>

          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            {showYear && year && (
              <>
                <CalendarIcon className="h-3 w-3" />
                <span>{year}</span>
              </>
            )}

            {showRuntime && runtime && (
              <>
                {showYear && year && <span>•</span>}
                <ClockIcon className="h-3 w-3" />
                <span>{formatRuntime(runtime)}</span>
              </>
            )}

            {!showYear &&
              !showRuntime &&
              showRating &&
              movie.vote_average > 0 && (
                <>
                  <StarIcon className="h-3 w-3" />
                  <span>{formatRating(movie.vote_average)}</span>
                </>
              )}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface MovieGridProps {
  movies: (Movie | TMDbMovie)[];
  loading?: boolean;
  showRating?: boolean;
  showYear?: boolean;
  showRuntime?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function MovieGrid({
  movies,
  loading = false,
  showRating = true,
  showYear = true,
  showRuntime = false,
  size = 'md',
}: MovieGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="bg-muted aspect-[2/3] animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="bg-muted h-4 animate-pulse rounded" />
              <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">🎬</div>
        <h3 className="mb-2 text-lg font-medium">No movies found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard
          key={'tmdb_id' in movie ? movie.tmdb_id : movie.id}
          movie={movie}
          showRating={showRating}
          showYear={showYear}
          showRuntime={showRuntime}
          size={size}
        />
      ))}
    </div>
  );
}
