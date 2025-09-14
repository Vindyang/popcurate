// On-demand TMDB fetch for new watchlist movies
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchTMDBMovie(movie_id: number) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!resp.ok) return null;
  return await resp.json();
}

export async function addMovieToWatchlist(user_id: string, movie_id: number) {
  // Check if movie exists in movies table
  const { data: existing } = await supabase
    .from('movies')
    .select('movie_id')
    .eq('movie_id', movie_id)
    .single();
  if (!existing) {
    const tmdb = await fetchTMDBMovie(movie_id);
    if (tmdb) {
      await supabase.from('movies').insert([
        {
          movie_id: tmdb.id,
          overview: tmdb.overview,
          title: tmdb.title,
          genres:
            tmdb.genres?.map((g: { name: string }) => g.name).join(', ') ?? '',
          release_date: tmdb.release_date,
          poster_path: tmdb.poster_path,
          tmdb_data: JSON.stringify(tmdb),
        },
      ]);
    }
  }
  // Add to watchlists table
  await supabase.from('watchlists').insert([
    {
      user_id,
      movie_id,
    },
  ]);
}
