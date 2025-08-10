'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TMDbMovie } from '@/types/tmdb';
import { Spinner } from '@/components/ui/spinner';
import { cn, formatRating } from '@/lib/utils';

interface SearchSuggestionsProps {
  suggestions: TMDbMovie[];
  isLoading: boolean;
  error: string | null;
  onSuggestionClick: () => void;
  className?: string;
}

export function SearchSuggestions({
  suggestions,
  isLoading,
  error,
  onSuggestionClick,
  className,
}: SearchSuggestionsProps) {
  if (!isLoading && !error && suggestions.length === 0) {
    return null;
  }

  const getImageUrl = (posterPath: string | null) => {
    if (!posterPath) return '/placeholder-movie.svg';
    return `https://image.tmdb.org/t/p/w92${posterPath}`;
  };

  const getMovieSlug = (movie: TMDbMovie) => {
    const titleSlug = movie.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${titleSlug}-${movie.id}`;
  };

  return (
    <div
      className={cn(
        'bg-background border-border absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-md border shadow-lg',
        className
      )}
    >
      {isLoading && (
        <div className="text-muted-foreground p-4 text-center">
          <Spinner size="sm" className="mx-auto" />
          <span className="mt-2 block text-sm">Searching...</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-sm text-red-500">{error}</div>
      )}

      {!isLoading && !error && suggestions.length > 0 && (
        <ul className="py-2">
          {suggestions.map((movie) => (
            <li key={movie.id}>
              <Link
                href={`/movie/${getMovieSlug(movie)}`}
                onClick={onSuggestionClick}
                className="hover:bg-muted flex cursor-pointer items-center p-3 transition-colors"
              >
                <div className="bg-muted mr-3 h-16 w-12 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    width={48}
                    height={64}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-movie.svg';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-foreground truncate font-medium">
                    {movie.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : 'Unknown'}
                  </p>
                  {movie.vote_average > 0 && (
                    <div className="mt-1 flex items-center">
                      <span className="text-muted-foreground text-xs">
                        ⭐ {formatRating(movie.vote_average)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
