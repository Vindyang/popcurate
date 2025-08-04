import Link from 'next/link';
import { tmdbClient } from '@/lib/tmdb/client';
import type { TMDbMovieDetails } from '@/types/tmdb';

interface DetailedMovieInfoProps {
  movie: TMDbMovieDetails;
}

function formatCurrency(amount: number): string {
  if (amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatLanguages(
  languages: Array<{ english_name: string; name: string }>
): string {
  return languages.map((lang) => lang.english_name).join(', ');
}

export async function DetailedMovieInfo({ movie }: DetailedMovieInfoProps) {
  let externalIds: {
    imdb_id?: string;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
    wikidata_id?: string;
  } | null = null;

  try {
    externalIds = await tmdbClient.getMovieExternalIds(movie.id);
  } catch (error) {
    console.error('Error fetching external IDs:', error);
  }

  const details = [
    {
      label: 'Original Title',
      value: movie.original_title !== movie.title ? movie.original_title : null,
    },
    {
      label: 'Original Language',
      value: movie.original_language?.toUpperCase(),
    },
    {
      label: 'Spoken Languages',
      value:
        movie.spoken_languages?.length > 0
          ? formatLanguages(movie.spoken_languages)
          : null,
    },
    {
      label: 'Status',
      value: movie.status,
    },
    {
      label: 'Budget',
      value: movie.budget ? formatCurrency(movie.budget) + ' (USD)' : null,
    },
    {
      label: 'Revenue',
      value: movie.revenue ? formatCurrency(movie.revenue) + ' (USD)' : null,
    },
    {
      label: 'Popularity Score',
      value: movie.popularity ? Math.round(movie.popularity).toString() : null,
    },
  ].filter((detail) => detail.value && detail.value !== 'N/A');

  const hasExternalLinks = externalIds?.imdb_id || movie.homepage;

  if (details.length === 0 && !hasExternalLinks) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Detailed Information */}
      {details.length > 0 && (
        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
            Movie Details
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((detail) => (
              <div key={detail.label} className="space-y-1">
                <h4 className="text-sm font-medium">{detail.label}</h4>
                <p className="text-muted-foreground text-sm">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      {hasExternalLinks && (
        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
            External Links
          </h3>
          <div className="flex flex-wrap gap-3">
            {externalIds?.imdb_id && (
              <Link
                href={`https://www.imdb.com/title/${externalIds.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-yellow-400"
              >
                <span>IMDb</span>
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-4M14 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2m8 0h2l-4 8-4-8h2"
                  />
                </svg>
              </Link>
            )}

            {movie.homepage && (
              <Link
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <span>Official Website</span>
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-4M14 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2m8 0h2l-4 8-4-8h2"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
