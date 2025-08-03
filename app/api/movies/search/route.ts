import { NextRequest } from 'next/server';

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

    // If API key is available, use the real TMDB client
    // For now, return mock data to demonstrate the pattern
    const mockResults = {
      page: 1,
      results: [
        {
          id: 1,
          title: `Sample result for "${query}"`,
          overview:
            'This is a mock search result. Add TMDB_API_KEY to get real data.',
          poster_path: null,
          backdrop_path: null,
          release_date: '2024-01-01',
          runtime: 120,
          vote_average: 8.0,
          vote_count: 100,
          popularity: 50,
          adult: false,
          genre_ids: [28],
          original_language: 'en',
          original_title: `Sample result for "${query}"`,
          video: false,
        },
      ],
      total_pages: 1,
      total_results: 1,
    };

    return Response.json(mockResults);
  } catch (error) {
    console.error('Movie search error:', error);
    return Response.json({ error: 'Failed to search movies' }, { status: 500 });
  }
}
