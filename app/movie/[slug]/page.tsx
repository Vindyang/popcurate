'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarFilledIcon } from '@heroicons/react/24/solid';
import { getImageUrl, formatRating, formatRuntime } from '@/lib/utils';
import type { TMDbMovieDetails } from '@/types/tmdb';

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [movie, setMovie] = useState<TMDbMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    // Extract movie ID from slug (assuming slug format: "movie-title-year-id")
    const parts = slug.split('-');
    const movieId = parts[parts.length - 1];

    if (!movieId || isNaN(Number(movieId))) {
      setError('Invalid movie ID');
      setLoading(false);
      return;
    }

    const fetchMovie = async () => {
      try {
        setLoading(true);
        // Use our API route instead of direct tmdbClient call
        const response = await fetch(`/api/movies/${movieId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch movie details');
        }

        const movieData = await response.json();
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load movie details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted mb-6 h-6 w-32 rounded"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="bg-muted aspect-[2/3] rounded-lg"></div>
              </div>
              <div className="space-y-4 lg:col-span-2">
                <div className="bg-muted h-8 w-3/4 rounded"></div>
                <div className="bg-muted h-4 w-1/2 rounded"></div>
                <div className="bg-muted h-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold">Movie Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The movie you're looking for doesn't exist."}
            </p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const genres = movie.genres?.map((g) => g.name).join(', ') || 'N/A';

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Movie Details */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
              {movie.poster_path ? (
                <Image
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="bg-muted flex h-full items-center justify-center">
                  <span className="text-4xl">🎬</span>
                </div>
              )}
            </div>
          </div>

          {/* Movie Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title and Basic Info */}
            <div>
              <h1 className="mb-2 text-3xl font-bold">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-muted-foreground mb-4 text-lg italic">
                  {movie.tagline}
                </p>
              )}

              <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                {year && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{year}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1">
                    <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                    <span>{formatRating(movie.vote_average)}</span>
                    <span className="text-xs">({movie.vote_count} votes)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                Genres
              </h3>
              <p>{genres}</p>
            </div>

            {/* Overview */}
            {movie.overview && (
              <div>
                <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                  Overview
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              {movie.production_companies &&
                movie.production_companies.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">
                      Production Companies
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {movie.production_companies.map((c) => c.name).join(', ')}
                    </p>
                  </div>
                )}

              {movie.production_countries &&
                movie.production_countries.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Countries</h4>
                    <p className="text-muted-foreground text-sm">
                      {movie.production_countries.map((c) => c.name).join(', ')}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
