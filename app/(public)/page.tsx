import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieCard } from '@/components/movie/movie-card';
import { GenreSelector } from '@/components/movie/genre-selector';
import { tmdbClient } from '@/lib/tmdb/client';
import type { TMDbMovie } from '@/types/tmdb';
import { getServerSession } from '@/lib/betterauth/get-session';
import { fetchRecommendedMovies } from '@/components/movie/recommended-movies-fetch';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch trending movies to create dynamic description
    const trending = await tmdbClient.getTrendingMovies('week', 1);
    const topMovies = trending.results
      .slice(0, 3)
      .map((m) => m.title)
      .join(', ');

    const description = topMovies
      ? `Discover your next favorite movie with personalized recommendations. Trending now: ${topMovies}. Browse popular, top-rated, and upcoming movies.`
      : 'Discover your next favorite movie with personalized recommendations, create watchlists, and explore trending, popular, and top-rated films.';

    return {
      title: 'Popcurate - Discover Curated Movie Recommendations & Personalized Watchlists',
      description,
      keywords: [
        'Popcurate',
        'popcurate movie app',
        'movie recommendations',
        'curated movies',
        'personalized movie recommendations',
        'movie watchlist',
        'movie discovery platform',
        'trending movies',
        'popular movies',
        'top rated movies',
        'movie database',
        'film recommendations',
        'what to watch',
        'movie finder',
        'cinema',
        'films',
        'best movies',
        'movie suggestions',
      ],
      openGraph: {
        title: 'Popcurate - Discover Your Next Favorite Movie',
        description,
        type: 'website',
        url: 'https://popcurate.vercel.app',
        siteName: 'Popcurate',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Popcurate - Curated Movie Recommendations',
        description,
        site: '@popcurate',
      },
      alternates: {
        canonical: 'https://popcurate.vercel.app',
      },
    };
  } catch (error) {
    console.error('Error generating home page metadata:', error);
    return {
      title: 'Popcurate - Curated Movie Recommendations',
      description:
        'Discover your next favorite movie with personalized recommendations, create watchlists, and connect with fellow movie enthusiasts.',
    };
  }
}

export default async function Home() {
  // Get current user session
  const session = await getServerSession();
  const userId = session?.user?.id;

  // Prepare recommended movies
  let recommendedMovies: TMDbMovie[] = [];
  if (userId) {
    recommendedMovies = await fetchRecommendedMovies(userId);
  }

  // Fetch trending movies for ItemList schema
  let trendingMovies: TMDbMovie[] = [];
  try {
    const trending = await tmdbClient.getTrendingMovies('week', 1);
    trendingMovies = trending.results.slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending movies for schema:', error);
  }

  // ItemList Schema for trending movies
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Trending Movies on Popcurate',
    description: 'The most popular and trending movies this week on Popcurate',
    itemListElement: trendingMovies.map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : undefined,
        datePublished: movie.release_date,
        aggregateRating: movie.vote_average
          ? {
              '@type': 'AggregateRating',
              ratingValue: movie.vote_average.toFixed(1),
              ratingCount: movie.vote_count,
              bestRating: 10,
            }
          : undefined,
      },
    })),
  };

  return (
    <div className="min-h-screen">
      {/* JSON-LD structured data for trending movies */}
      {trendingMovies.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      {/* Hero Section with Background */}
      <section className="from-primary/5 via-background to-secondary/5 relative overflow-hidden bg-gradient-to-br py-12 lg:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="text-primary">Popcurate:</span> Find Your
                  Next
                  <br />
                  Favorite Movie
                </h1>
                <p className="text-muted-foreground text-lg sm:text-xl">
                  Discover, explore, and curate your perfect movie collection
                  with Popcurate - your personalized movie recommendation
                  platform.
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
      <hr className="my-8 border-t border-gray-700" />

      {/* Recommended for you Section */}
      {recommendedMovies.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <MovieSection
              title="Recommended for you"
              description="Movies picked just for you based on your watchlists"
              movies={recommendedMovies}
            />
          </div>
        </section>
      )}

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
  movies: moviesProp,
}: {
  title: string;
  description: string;
  endpoint?: string;
  movies?: TMDbMovie[];
}) {
  let movies: TMDbMovie[] = [];

  if (moviesProp && moviesProp.length > 0) {
    movies = moviesProp;
  } else if (endpoint) {
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
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {endpoint && (
          <Button asChild variant="outline">
            <Link href={endpoint}>View All</Link>
          </Button>
        )}
      </div>

      {/* Movie grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {movies.length > 0
          ? movies.map((movie, idx) => (
              <MovieCard
                key={movie.id ?? idx}
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
