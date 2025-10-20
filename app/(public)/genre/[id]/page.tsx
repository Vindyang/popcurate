import { Suspense } from 'react';
import { tmdbClient } from '@/lib/tmdb/client';
import { MovieCard } from '@/components/movie/movie-card';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

interface GenrePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function GenrePage({
  params,
  searchParams,
}: GenrePageProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const genreId = parseInt(id);
  const page = parseInt(pageParam || '1');

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

    // Breadcrumb schema for SEO
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
          name: `${genre.name} Movies`,
          item: `https://popcurate.vercel.app/genre/${genreId}`,
        },
      ],
    };

    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* JSON-LD structured data - Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {genre.name} Movies
          </h1>
          <p className="text-muted-foreground">
            Discover the best {genre.name.toLowerCase()} movies
          </p>
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const genreId = parseInt(id);

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
      description: `Discover the best ${genre.name.toLowerCase()} movies. Browse popular, trending, and top-rated ${genre.name.toLowerCase()} films on Popcurate.`,
      keywords: [
        genre.name,
        `${genre.name} movies`,
        `${genre.name} films`,
        'movie discovery',
        'film recommendations',
        'movies',
      ],
      openGraph: {
        title: `${genre.name} Movies | Popcurate`,
        description: `Discover the best ${genre.name.toLowerCase()} movies on Popcurate`,
        type: 'website',
        url: `/genre/${genreId}`,
        siteName: 'Popcurate',
      },
      twitter: {
        card: 'summary',
        title: `${genre.name} Movies | Popcurate`,
        description: `Discover the best ${genre.name.toLowerCase()} movies`,
      },
    };
  } catch {
    return {
      title: 'Genre Movies | Popcurate',
    };
  }
}
