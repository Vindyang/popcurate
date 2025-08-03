import { NextRequest } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id);

    if (isNaN(movieId)) {
      return Response.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    // Check if TMDB API key is available
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: 'TMDB API key not configured',
          message: 'Please add TMDB_API_KEY to your environment variables.',
        },
        { status: 500 }
      );
    }

    // Fetch movie details from TMDB
    const movieDetails = await tmdbClient.getMovieDetails(movieId);

    return Response.json(movieDetails);
  } catch (error) {
    console.error('Movie details error:', error);

    if (error instanceof Error && error.message.includes('404')) {
      return Response.json({ error: 'Movie not found' }, { status: 404 });
    }

    return Response.json(
      {
        error: 'Failed to fetch movie details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
