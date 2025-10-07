import { NextRequest, NextResponse } from 'next/server';
import { recommendImplicitMovies } from '@/lib/algorithm/ImplicitRecService';
import { tmdbClient } from '@/lib/tmdb/client';
import { createClient } from '@/lib/supabase/client';
import type { TMDbMovie } from '@/types/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const genre = searchParams.get('genre');

    // Check if user has watchlists
    const supabase = createClient();
    const { data: watchlists, error: watchlistError } = await supabase
      .from('watchlists')
      .select('id')
      .eq('user_id', userId);

    if (watchlistError) {
      return NextResponse.json(
        { error: 'Failed to fetch user watchlists' },
        { status: 500 }
      );
    }

    if (!watchlists || watchlists.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: 'No watchlists found. Add movies to your watchlist first!',
      });
    }

    // Get recommendations
    const recs = await recommendImplicitMovies(userId, limit);

    // Fetch full movie details from TMDb
    const movies: TMDbMovie[] = await Promise.all(
      recs.map(
        async (rec: {
          itemId: string;
          score: number;
          matched_movie?: string;
        }) => {
          const tmdb = await tmdbClient.getMovieDetails(Number(rec.itemId));
          return {
            id: tmdb.id,
            title: tmdb.title,
            poster_path: tmdb.poster_path,
            backdrop_path: tmdb.backdrop_path,
            vote_average: tmdb.vote_average ?? 0,
            release_date: tmdb.release_date ?? '',
            overview: tmdb.overview ?? '',
            genre_ids: tmdb.genres?.map((g: { id: number }) => g.id) ?? [],
            runtime: tmdb.runtime ?? null,
            score: rec.score,
            matched_movie: rec.matched_movie, // From Gemini enhancement
          };
        }
      )
    );

    // Filter by genre if specified
    let filteredMovies = movies;
    if (genre) {
      const genreId = parseInt(genre);
      filteredMovies = movies.filter((movie) =>
        movie.genre_ids?.includes(genreId)
      );
    }

    return NextResponse.json({
      recommendations: filteredMovies,
      total: filteredMovies.length,
      userId,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);

    // Handle specific error cases
    if (
      error instanceof Error &&
      error.message.includes('No recommendations found')
    ) {
      return NextResponse.json({
        recommendations: [],
        message:
          'Recommendations not generated yet. Please run the training script.',
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
