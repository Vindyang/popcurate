import { NextRequest, NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/tmdb/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = parseInt(id);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    const videos = await tmdbClient.getMovieVideos(movieId);

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie videos' },
      { status: 500 }
    );
  }
}
