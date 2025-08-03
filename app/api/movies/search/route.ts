import { NextRequest } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return Response.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Check if TMDB API key is available
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: 'TMDB API key not configured',
          message:
            'Please add TMDB_API_KEY to your environment variables to enable movie search.',
          results: [],
        },
        { status: 200 }
      );
    }

    // Use the real TMDB client to search for movies
    const searchResults = await tmdbClient.searchMovies(query);

    return Response.json(searchResults);
  } catch (error) {
    console.error('Movie search error:', error);
    return Response.json(
      {
        error: 'Failed to search movies',
        results: [],
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
