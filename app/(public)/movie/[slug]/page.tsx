import { notFound } from 'next/navigation';
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
import { tmdbClient } from '@/lib/tmdb/client';
import { RelatedMovies } from '@/components/movie/related-movies';
import { DetailedMovieInfo } from '@/components/movie/detailed-movie-info';
import { AddToWatchlistButton } from '@/components/movie/add-to-watchlist-button';
import { isMovieInWatchlist } from '@/app/(public)/watchlists/action/componentactions';
import type { TMDbMovieDetails } from '@/types/tmdb';

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { MovieVideos } from '@/components/movie/movie-videos';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Extract movie ID from slug
  const parts = slug.split('-');
  const movieIdString = parts[parts.length - 1];
  const movieId = parseInt(movieIdString);

  if (!movieIdString || isNaN(movieId)) {
    return {
      title: 'Movie Not Found | Popcurate',
      description: 'The requested movie could not be found.',
    };
  }

  try {
    const movie = await tmdbClient.getMovieDetails(movieId);
    const year = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : null;
    const genres = movie.genres?.map((g) => g.name).join(', ') || '';

    // Create meta description
    const description =
      movie.overview && movie.overview.length > 0
        ? movie.overview.length > 155
          ? `${movie.overview.substring(0, 152)}...`
          : movie.overview
        : `Watch ${movie.title}${year ? ` (${year})` : ''}. ${genres ? `Genres: ${genres}.` : ''} Discover movie details, trailers, and recommendations on Popcurate.`;

    // OpenGraph image
    const ogImage = movie.poster_path
      ? getImageUrl(movie.poster_path, 'w500')
      : movie.backdrop_path
        ? getImageUrl(movie.backdrop_path, 'w780')
        : undefined;

    return {
      title: `${movie.title}${year ? ` (${year})` : ''} | Popcurate`,
      description,
      keywords: [
        movie.title,
        ...(movie.genres?.map((g) => g.name) || []),
        'movie',
        'film',
        'watch',
        'recommendations',
        ...(year ? [year.toString()] : []),
      ],
      openGraph: {
        title: `${movie.title}${year ? ` (${year})` : ''}`,
        description,
        type: 'video.movie',
        url: `/movie/${slug}`,
        siteName: 'Popcurate',
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 500,
                height: 750,
                alt: `${movie.title} poster`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${movie.title}${year ? ` (${year})` : ''}`,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Movie Details | Popcurate',
      description: 'Discover movie details and recommendations on Popcurate.',
    };
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Extract movie ID from slug (assuming slug format: "movie-title-year-id")
  const parts = slug.split('-');
  const movieIdString = parts[parts.length - 1];
  const movieId = parseInt(movieIdString);

  if (!movieIdString || isNaN(movieId)) {
    notFound();
  }

  let movie: TMDbMovieDetails | null = null;

  try {
    movie = await tmdbClient.getMovieDetails(movieId);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    notFound();
  }

  // SSR: Check if movie is in user's watchlist
  let initialAdded = false;
  try {
    initialAdded = await isMovieInWatchlist(movieId);
  } catch (err) {
    console.error('Error checking watchlist status:', err);
    initialAdded = false;
  }

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const genres = movie.genres?.map((g) => g.name).join(', ') || 'N/A';

  // Generate JSON-LD structured data for SEO
  const movieSchema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    image: movie.poster_path
      ? getImageUrl(movie.poster_path, 'original')
      : undefined,
    datePublished: movie.release_date,
    description: movie.overview,
    genre: movie.genres?.map((g) => g.name),
    aggregateRating: movie.vote_average
      ? {
          '@type': 'AggregateRating',
          ratingValue: movie.vote_average.toFixed(1),
          ratingCount: movie.vote_count,
          bestRating: 10,
          worstRating: 0,
        }
      : undefined,
    productionCompany: movie.production_companies?.map((company) => ({
      '@type': 'Organization',
      name: company.name,
    })),
    countryOfOrigin: movie.production_countries?.map((country) => ({
      '@type': 'Country',
      name: country.name,
    })),
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://popcurate.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: movie.title,
        item: `https://popcurate.vercel.app/movie/${slug}`,
      },
    ],
  };

  return (
    <div className="bg-background min-h-screen">
      {/* JSON-LD structured data - Movie Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      {/* JSON-LD structured data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 cursor-pointer border border-gray-300"
          >
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

              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
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
                      <span className="text-xs">
                        ({movie.vote_count} votes)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Watchlist Button - Responsive, above Genres */}
            <div className="mx-auto mt-4 w-full max-w-xs sm:mt-6 sm:max-w-none">
              <AddToWatchlistButton
                movieId={movieId}
                title={movie.title}
                initialAdded={initialAdded}
              />
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

        {/* Movie Videos & Trailers */}
        <div className="mt-16">
          <MovieVideos movieId={movieId} />
        </div>

        {/* Detailed Movie Information */}
        <div className="mt-16">
          <DetailedMovieInfo movie={movie} />
        </div>

        {/* Related Movies */}
        <div className="mt-16">
          <RelatedMovies movie={movie} />
        </div>
      </div>
    </div>
  );
}
