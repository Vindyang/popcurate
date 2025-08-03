import { Button } from '@/components/ui/button';
import {
  FireIcon,
  TrophyIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SearchMovies } from '@/components/movie/search-movies';

export default async function DiscoverPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Discover Movies
        </h1>
        <p className="text-muted-foreground">
          Explore trending movies, top-rated classics, and personalized
          recommendations just for you.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Search Movies</h2>
        <SearchMovies />
        <p className="mt-2 text-sm text-amber-600">
          📝 Note: Search requires TMDB_API_KEY environment variable to work
        </p>
      </div>

      {/* Migration Demo Note */}
      <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <h3 className="font-semibold text-green-900 dark:text-green-100">
          ✅ TanStack Query Successfully Removed
        </h3>
        <p className="mt-2 text-sm text-green-800 dark:text-green-200">
          This app now uses native Next.js patterns for data fetching:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-green-700 dark:text-green-300">
          <li>
            <strong>Server Components:</strong> For initial data loading (see
            /trending)
          </li>
          <li>
            <strong>Client Components:</strong> For interactive features (search
            above)
          </li>
          <li>
            <strong>API Routes:</strong> For client-side data fetching
          </li>
        </ul>
      </div>

      {/* Quick Categories */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/trending"
          className="group relative rounded-lg border bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 transition-all hover:scale-105 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-500/20 p-3">
              <FireIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                Trending
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Hot right now
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/top-rated"
          className="group relative rounded-lg border bg-gradient-to-br from-yellow-500/10 to-amber-500/10 p-6 transition-all hover:scale-105 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-yellow-500/20 p-3">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Top Rated
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Critically acclaimed
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/upcoming"
          className="group relative rounded-lg border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 transition-all hover:scale-105 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/20 p-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Upcoming
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Coming soon
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/recommendations"
          className="group relative rounded-lg border bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 transition-all hover:scale-105 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-500/20 p-3">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                For You
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Personalized picks
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Genres Grid */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Browse by Genre</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}`}
              className="bg-background group relative rounded-lg border p-4 text-center transition-all hover:scale-105 hover:shadow-md"
            >
              <div className="mb-2 text-2xl">{genre.emoji}</div>
              <h3 className="text-sm font-medium">{genre.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Coming Soon: Movie Sections */}
      <div className="space-y-12">
        <MovieSection
          title="Trending This Week"
          description="The most popular movies right now"
          endpoint="/trending"
        />

        <MovieSection
          title="Top Rated Movies"
          description="The highest-rated movies of all time"
          endpoint="/top-rated"
        />

        <MovieSection
          title="Now Playing"
          description="Movies currently in theaters"
          endpoint="/now-playing"
        />
      </div>
    </div>
  );
}

// Movie Section Component (placeholder for now)
function MovieSection({
  title,
  description,
  endpoint,
}: {
  title: string;
  description: string;
  endpoint: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={endpoint}>View All</Link>
        </Button>
      </div>

      {/* Placeholder for movie grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted aspect-[2/3] animate-pulse rounded-lg"
          />
        ))}
      </div>
    </section>
  );
}

// Sample genres data
const genres = [
  { id: 28, name: 'Action', emoji: '💥' },
  { id: 12, name: 'Adventure', emoji: '🗺️' },
  { id: 35, name: 'Comedy', emoji: '😂' },
  { id: 18, name: 'Drama', emoji: '🎭' },
  { id: 27, name: 'Horror', emoji: '👻' },
  { id: 10749, name: 'Romance', emoji: '❤️' },
  { id: 878, name: 'Sci-Fi', emoji: '🚀' },
  { id: 53, name: 'Thriller', emoji: '😱' },
  { id: 16, name: 'Animation', emoji: '🎨' },
  { id: 14, name: 'Fantasy', emoji: '🔮' },
  { id: 80, name: 'Crime', emoji: '🕵️' },
  { id: 9648, name: 'Mystery', emoji: '🔍' },
];
