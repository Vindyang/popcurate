import { NextRequest, NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');

    const response = await tmdbClient.getNowPlayingMovies(page);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch now playing movies' },
      { status: 500 }
    );
  }
}
