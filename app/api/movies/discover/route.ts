import { NextRequest, NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const genreId = searchParams.get('genre');
    const year = searchParams.get('year');
    const sortBy = searchParams.get('sort_by') || 'popularity.desc';
    const minRating = searchParams.get('min_rating');
    const maxRuntime = searchParams.get('max_runtime');

    const filters: {
      genre?: string;
      year?: number;
      sortBy?: string;
      page?: number;
      minRating?: number;
      maxRuntime?: number;
    } = {
      page,
      sortBy,
    };

    if (genreId) filters.genre = genreId;
    if (year) filters.year = parseInt(year);
    if (minRating) filters.minRating = parseFloat(minRating);
    if (maxRuntime) filters.maxRuntime = parseInt(maxRuntime);

    const response = await tmdbClient.discoverMovies(filters);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error discovering movies:', error);
    return NextResponse.json(
      { error: 'Failed to discover movies' },
      { status: 500 }
    );
  }
}
