import { NextRequest, NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');

    const response = await tmdbClient.getTopRatedMovies(page);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top rated movies' },
      { status: 500 }
    );
  }
}
