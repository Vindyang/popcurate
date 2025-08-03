import { NextRequest, NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const timeWindow = (searchParams.get('time_window') || 'week') as
      | 'day'
      | 'week';

    const response = await tmdbClient.getTrendingMovies(timeWindow, page);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending movies' },
      { status: 500 }
    );
  }
}
