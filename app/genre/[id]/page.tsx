import { Suspense } from 'react';
import { tmdbClient } from '@/lib/tmdb/client';
import { MovieCard } from '@/components/movie/movie-card';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

interface GenrePageProps {
  params: { id: string };
  searchParams: { page?: string };
}

// Default genres with emojis for display
const genreEmojis: Record<number, string> = {
  28: '💥', // Action
  12: '🗺️', // Adventure
  35: '😂', // Comedy
  18: '🎭', // Drama
  27: '👻', // Horror
  10749: '❤️', // Romance
  878: '🚀', // Sci-Fi
  53: '😱', // Thriller
  16: '🎨', // Animation
  14: '🔮', // Fantasy
  80: '🕵️', // Crime
  9648: '🔍', // Mystery
  99: '📚', // Documentary
  10751: '👨‍👩‍👧‍👦', // Family
  36: '🏛️', // History
  10402: '🎵', // Music
  37: '🤠', // Western
  10752: '⚔️', // War
  10770: '📺', // TV Movie
};

export default async function GenrePage({
  params,
  searchParams,
}: GenrePageProps) {
  const genreId = parseInt(params.id);
  const page = parseInt(searchParams.page || '1');

  if (isNaN(genreId)) {
    notFound();
  }

  try {
    // Fetch movies for this genre
    const movies = await tmdbClient.discoverMovies({
      genre: genreId.toString(),
      page,
      sortBy: 'popularity.desc',
    });

    // Get genre name
    const genresResponse = await tmdbClient.getGenres();
    const genre = genresResponse.genres.find((g) => g.id === genreId);

    if (!genre) {
      notFound();
    }

    const emoji = genreEmojis[genreId] || '🎬';

    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-lg bg-purple-500/20 p-3">
            <span className="text-2xl">{emoji}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {genre.name} Movies
            </h1>
            <p className="text-muted-foreground">
              Discover the best {genre.name.toLowerCase()} movies
            </p>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">
            Showing {movies.results.length} of{' '}
            {movies.total_results.toLocaleString()} movies
          </p>
        </div>

        {/* Movies Grid */}
        <Suspense fallback={<div>Loading movies...</div>}>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.results.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                showRating={true}
                showYear={true}
                size="md"
              />
            ))}
          </div>
        </Suspense>

        {/* Pagination */}
        {movies.total_pages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {page > 1 && (
              <Button variant="outline" asChild>
                <a href={`?page=${page - 1}`}>Previous</a>
              </Button>
            )}

            <span className="flex items-center px-4 py-2 text-sm">
              Page {page} of {movies.total_pages}
            </span>

            {page < movies.total_pages && (
              <Button variant="outline" asChild>
                <a href={`?page=${page + 1}`}>Next</a>
              </Button>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching genre movies:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const genreId = parseInt(params.id);

  try {
    const genresResponse = await tmdbClient.getGenres();
    const genre = genresResponse.genres.find((g) => g.id === genreId);

    if (!genre) {
      return {
        title: 'Genre Not Found | Popcurate',
      };
    }

    return {
      title: `${genre.name} Movies | Popcurate`,
      description: `Discover the best ${genre.name.toLowerCase()} movies.`,
    };
  } catch {
    return {
      title: 'Genre Movies | Popcurate',
    };
  }
}
