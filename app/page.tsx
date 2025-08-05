import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieCard } from '@/components/movie/movie-card';
import { GenreSelector } from '@/components/movie/genre-selector';
import { tmdbClient } from '@/lib/tmdb/client';
import type { TMDbMovie } from '@/types/tmdb';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section className="from-primary/5 via-background to-secondary/5 relative overflow-hidden bg-gradient-to-br py-12 lg:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Find Your Next
                  <br />
                  <span className="text-primary">Favorite Movie</span>
                </h1>
                <p className="text-muted-foreground text-lg sm:text-xl">
                  Discover, explore, and curate your perfect movie collection
                  with Popcurate.
                </p>
              </div>
            </div>

            {/* Right Column - Genre Selector */}
            <div className="relative">
              <div className="from-primary/10 to-secondary/10 aspect-[4/3] rounded-2xl bg-gradient-to-br p-6">
                <GenreSelector />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies Sections */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="space-y-16">
            <MovieSection
              title="Trending This Week"
              description="The most popular movies everyone's talking about"
              endpoint="/trending"
            />

            <MovieSection
              title="Highest Rated"
              description="Critically acclaimed masterpieces you shouldn't miss"
              endpoint="/top-rated"
            />

            <MovieSection
              title="Now Playing"
              description="Movies currently showing in theaters worldwide"
              endpoint="/now-playing"
            />

            <MovieSection
              title="Coming Soon"
              description="Upcoming movies to add to your watchlist"
              endpoint="/upcoming"
            />

            <MovieSection
              title="Popular Movies"
              description="Most popular movies right now"
              endpoint="/popular"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Movie Section Component - now fetches real data
async function MovieSection({
  title,
  description,
  endpoint,
}: {
  title: string;
  description: string;
  endpoint: string;
}) {
  let movies: TMDbMovie[] = [];

  try {
    // Fetch movies based on the endpoint
    let response;
    switch (endpoint) {
      case '/trending':
        response = await tmdbClient.getTrendingMovies('week', 1);
        break;
      case '/top-rated':
        response = await tmdbClient.getTopRatedMovies(1);
        break;
      case '/now-playing':
        response = await tmdbClient.getNowPlayingMovies(1);
        break;
      case '/upcoming':
        response = await tmdbClient.getUpcomingMovies(1);
        break;
      case '/popular':
        response = await tmdbClient.getPopularMovies(1);
        break;
      default:
        response = await tmdbClient.getPopularMovies(1);
    }

    // Take first 6 movies for the preview
    movies = response.results.slice(0, 6);
  } catch (error) {
    console.error(`Error fetching movies for ${endpoint}:`, error);
    // Fallback to empty array if there's an error
    movies = [];
  }

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

      {/* Movie grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {movies.length > 0
          ? movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                size="sm"
                showRating={true}
                showYear={true}
              />
            ))
          : // Fallback placeholders if no movies or error
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3]" />
            ))}
      </div>
    </section>
  );
}
