'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  FireIcon,
  TrophyIcon,
  ClockIcon,
  SparklesIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { SearchMovies } from '@/components/movie/search-movies';
import { MovieCard } from '@/components/movie/movie-card';
import { tmdbClient } from '@/lib/tmdb/client';
import type { TMDbMovie } from '@/types/tmdb';

import { useEffect, useState } from 'react';

export default function Home() {
  const [genres, setGenres] = useState(defaultGenres);

  useEffect(() => {
    let isMounted = true;
    tmdbClient
      .getGenres()
      .then((genresResponse: { genres: { id: number; name: string }[] }) => {
        const mappedGenres = genresResponse.genres.map(
          (genre: { id: number; name: string }) => {
            const defaultGenre = defaultGenres.find(
              (g: { id: number; name: string; emoji: string }) =>
                g.id === genre.id
            );
            return {
              id: genre.id,
              name: genre.name,
              emoji: defaultGenre?.emoji || '🎬',
            };
          }
        );
        if (isMounted) setGenres(mappedGenres);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
        // fallback to defaultGenres
      });
    return () => {
      isMounted = false;
    };
  }, []);

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

              {/* Search Bar */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What are you in the mood for?
                </label>
                <SearchMovies />
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="px-6">
                  <Link href="/trending">
                    <FireIcon className="mr-2 h-5 w-5" />
                    Trending Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-6">
                  <Link href="/top-rated">
                    <TrophyIcon className="mr-2 h-5 w-5" />
                    Top Rated
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Featured Movie or Showcase */}
            <div className="relative">
              <div className="from-primary/10 to-secondary/10 aspect-[4/3] rounded-2xl bg-gradient-to-br p-8">
                <div className="flex h-full flex-col justify-center space-y-4 text-center">
                  <div className="text-6xl">🎬</div>
                  <h3 className="text-xl font-semibold">Millions of Movies</h3>
                  <p className="text-muted-foreground">
                    From blockbusters to indie gems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Browse Section */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">Quick Browse</h2>
            <p className="text-muted-foreground">
              Jump right into what you&apos;re looking for
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link
              href="/trending"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6 text-center transition-all hover:scale-105"
            >
              <FireIcon className="mx-auto mb-3 h-8 w-8 text-red-500" />
              <h3 className="font-semibold">Trending</h3>
              <p className="text-muted-foreground text-sm">What&apos;s hot</p>
            </Link>

            <Link
              href="/top-rated"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 p-6 text-center transition-all hover:scale-105"
            >
              <TrophyIcon className="mx-auto mb-3 h-8 w-8 text-yellow-600" />
              <h3 className="font-semibold">Top Rated</h3>
              <p className="text-muted-foreground text-sm">
                Critically acclaimed
              </p>
            </Link>

            <Link
              href="/upcoming"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 text-center transition-all hover:scale-105"
            >
              <ClockIcon className="mx-auto mb-3 h-8 w-8 text-blue-500" />
              <h3 className="font-semibold">Upcoming</h3>
              <p className="text-muted-foreground text-sm">Coming soon</p>
            </Link>

            <Link
              href="/now-playing"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 text-center transition-all hover:scale-105"
            >
              <SparklesIcon className="mx-auto mb-3 h-8 w-8 text-green-500" />
              <h3 className="font-semibold">In Theaters</h3>
              <p className="text-muted-foreground text-sm">Now playing</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Genres Section */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">Popular Genres</h2>
            <p className="text-muted-foreground">
              Find movies by your favorite genres
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {genres
              .slice(0, 8)
              .map((genre: { id: number; name: string; emoji: string }) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="group bg-background rounded-lg p-4 text-center transition-all hover:scale-105 hover:shadow-md"
                >
                  <div className="mb-2 text-3xl">{genre.emoji}</div>
                  <h3 className="text-xs font-medium sm:text-sm">
                    {genre.name}
                  </h3>
                </Link>
              ))}
          </div>

          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link
                href="#all-genres"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('all-genres')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View All Genres
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Advanced Filters Section */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">
              Advanced Discovery Tools
            </h2>
            <p className="text-muted-foreground">
              Fine-tune your movie search with powerful filters
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group from-muted/10 to-muted/20 relative rounded-lg border bg-gradient-to-br p-6 transition-all hover:scale-105 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <FunnelIcon className="text-foreground h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">
                    Filter by Rating
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    IMDb & TMDb ratings
                  </p>
                </div>
              </div>
            </div>

            <div className="group from-muted/10 to-muted/20 relative rounded-lg border bg-gradient-to-br p-6 transition-all hover:scale-105 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <CalendarIcon className="text-foreground h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">
                    Release Year
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    From classics to new
                  </p>
                </div>
              </div>
            </div>

            <div className="group from-muted/10 to-muted/20 relative rounded-lg border bg-gradient-to-br p-6 transition-all hover:scale-105 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <GlobeAltIcon className="text-foreground h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">By Country</h3>
                  <p className="text-muted-foreground text-sm">
                    International cinema
                  </p>
                </div>
              </div>
            </div>

            <div className="group from-muted/10 to-muted/20 relative rounded-lg border bg-gradient-to-br p-6 transition-all hover:scale-105 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <AdjustmentsHorizontalIcon className="text-foreground h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">
                    Custom Filters
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Runtime, language
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Genres Section */}
      <section id="all-genres" className="py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">All Genres</h2>
            <p className="text-muted-foreground">
              Explore every genre we have to offer
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {genres.map(
              (genre: { id: number; name: string; emoji: string }) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="group bg-background rounded-lg border p-4 text-center transition-all hover:scale-105 hover:shadow-md"
                >
                  <div className="mb-2 text-3xl">{genre.emoji}</div>
                  <h3 className="text-sm font-medium">{genre.name}</h3>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Movies Sections */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="space-y-16">
            <MovieSection
              title="🔥 Trending This Week"
              description="The most popular movies everyone's talking about"
              endpoint="/trending"
            />

            <MovieSection
              title="⭐ Highest Rated"
              description="Critically acclaimed masterpieces you shouldn't miss"
              endpoint="/top-rated"
            />

            <MovieSection
              title="🎭 Now Playing"
              description="Movies currently showing in theaters worldwide"
              endpoint="/now-playing"
            />

            <MovieSection
              title="🚀 Coming Soon"
              description="Upcoming movies to add to your watchlist"
              endpoint="/upcoming"
            />

            <MovieSection
              title="🎯 Popular Movies"
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
              <div
                key={i}
                className="bg-muted aspect-[2/3] animate-pulse rounded-lg"
              />
            ))}
      </div>
    </section>
  );
}

// Sample genres data with emojis (fallback)
const defaultGenres = [
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
