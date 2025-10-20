import { MetadataRoute } from 'next';
import { tmdbClient } from '@/lib/tmdb/client';
import { generateMovieSlug } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://popcurate.vercel.app';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/top-rated`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/now-playing`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/upcoming`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  try {
    // Fetch popular movies for dynamic routes
    const popularMovies = await tmdbClient.getPopularMovies(1);
    const trendingMovies = await tmdbClient.getTrendingMovies('week', 1);
    const topRatedMovies = await tmdbClient.getTopRatedMovies(1);

    // Combine and deduplicate movies
    const allMovies = [
      ...popularMovies.results,
      ...trendingMovies.results,
      ...topRatedMovies.results,
    ];

    const uniqueMovies = Array.from(
      new Map(allMovies.map((movie) => [movie.id, movie])).values()
    );

    // Generate movie routes (limited to top movies to avoid huge sitemap)
    const movieRoutes: MetadataRoute.Sitemap = uniqueMovies
      .slice(0, 100) // Limit to top 100 movies
      .map((movie) => {
        const year = movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : new Date().getFullYear();
        const slug = generateMovieSlug(movie.title, year, movie.id);

        return {
          url: `${baseUrl}/movie/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      });

    // Fetch genres
    const genresResponse = await tmdbClient.getGenres();
    const genreRoutes: MetadataRoute.Sitemap = genresResponse.genres.map(
      (genre) => ({
        url: `${baseUrl}/genre/${genre.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    );

    return [...staticRoutes, ...genreRoutes, ...movieRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static routes if API fails
    return staticRoutes;
  }
}
