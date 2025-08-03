import type {
  TMDbMovieDetails,
  TMDbSearchResponse,
  TMDbCredits,
  TMDbVideos,
  TMDbImages,
} from '@/types/tmdb';

const BASE_URL =
  process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

class TMDbClient {
  private getApiKey(): string {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new Error('TMDB_API_KEY environment variable is required');
    }
    return apiKey;
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', this.getApiKey());

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    // Debug logging
    const apiKey = this.getApiKey();
    console.log('Making request to:', url.hostname + url.pathname);
    console.log('API key being used:', apiKey.substring(0, 8) + '...');
    console.log(
      'Full URL (params hidden):',
      url.toString().replace(/api_key=[^&]*/, 'api_key=HIDDEN')
    );

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    console.log('Response status:', response.status);
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      throw new Error(
        `TMDb API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Search movies
  async searchMovies(query: string, page = 1): Promise<TMDbSearchResponse> {
    return this.request<TMDbSearchResponse>('/search/movie', {
      query,
      page: page.toString(),
      include_adult: 'false',
    });
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<TMDbMovieDetails> {
    return this.request<TMDbMovieDetails>(`/movie/${movieId}`);
  }

  // Get movie credits (cast and crew)
  async getMovieCredits(movieId: number): Promise<TMDbCredits> {
    return this.request<TMDbCredits>(`/movie/${movieId}/credits`);
  }

  // Get movie videos (trailers, teasers, etc.)
  async getMovieVideos(movieId: number): Promise<TMDbVideos> {
    return this.request<TMDbVideos>(`/movie/${movieId}/videos`);
  }

  // Get movie images
  async getMovieImages(movieId: number): Promise<TMDbImages> {
    return this.request<TMDbImages>(`/movie/${movieId}/images`);
  }

  // Get similar movies
  async getSimilarMovies(
    movieId: number,
    page = 1
  ): Promise<TMDbSearchResponse> {
    return this.request<TMDbSearchResponse>(`/movie/${movieId}/similar`, {
      page: page.toString(),
    });
  }

  // Get movie recommendations
  async getMovieRecommendations(
    movieId: number,
    page = 1
  ): Promise<TMDbSearchResponse> {
    return this.request<TMDbSearchResponse>(
      `/movie/${movieId}/recommendations`,
      {
        page: page.toString(),
      }
    );
  }

  // Get popular movies
  async getPopularMovies(page = 1): Promise<TMDbSearchResponse> {
    return this.request<TMDbSearchResponse>('/movie/popular', {
      page: page.toString(),
    });
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1): Promise<TMDbSearchResponse> {
    return this.request<TMDbSearchResponse>('/movie/top_rated', {
      page: page.toString(),
    });
  }

  // Get now playing movies
  async getNowPlayingMovies(page = 1): Promise<TMDbSearchResponse> {
    return this.request<TMDbSearchResponse>('/movie/now_playing', {
      page: page.toString(),
    });
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1): Promise<TMDbSearchResponse> {
    return this.request<TMDbSearchResponse>('/movie/upcoming', {
      page: page.toString(),
    });
  }

  // Get trending movies
  async getTrendingMovies(
    timeWindow: 'day' | 'week' = 'week',
    page = 1
  ): Promise<TMDbSearchResponse> {
    return this.request<TMDbSearchResponse>(`/trending/movie/${timeWindow}`, {
      page: page.toString(),
    });
  }

  // Discover movies with filters
  async discoverMovies(
    filters: {
      genre?: string;
      year?: number;
      sortBy?: string;
      page?: number;
      minRating?: number;
      maxRuntime?: number;
    } = {}
  ): Promise<TMDbSearchResponse> {
    const params: Record<string, string> = {
      page: (filters.page || 1).toString(),
      sort_by: filters.sortBy || 'popularity.desc',
    };

    if (filters.genre) params.with_genres = filters.genre;
    if (filters.year) params.year = filters.year.toString();
    if (filters.minRating)
      params['vote_average.gte'] = filters.minRating.toString();
    if (filters.maxRuntime)
      params['with_runtime.lte'] = filters.maxRuntime.toString();

    return this.request<TMDbSearchResponse>('/discover/movie', params);
  }

  // Get movie genres
  async getGenres() {
    return this.request<{ genres: Array<{ id: number; name: string }> }>(
      '/genre/movie/list'
    );
  }
}

export const tmdbClient = new TMDbClient();
