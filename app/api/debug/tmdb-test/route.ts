import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'No API key' }, { status: 500 });
  }

  try {
    // Test the exact same request as our working curl command
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
    console.log('Testing URL:', url.replace(apiKey, 'HIDDEN_KEY'));

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Test response status:', response.status);
    console.log(
      'Test response headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      return NextResponse.json(
        {
          error: `API error: ${response.status} ${response.statusText}`,
          body: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      resultsCount: data.results?.length || 0,
      firstMovie: data.results?.[0]?.title || 'No movies',
    });
  } catch (error) {
    console.error('Test request failed:', error);
    return NextResponse.json(
      {
        error: 'Request failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
