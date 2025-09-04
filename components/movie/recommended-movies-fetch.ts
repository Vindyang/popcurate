import { createClient } from '@/lib/supabase/client';
import { recommendImplicitMovies } from '@/lib/algorithm/ImplicitRecService';
import { tmdbClient } from '@/lib/tmdb/client';
import type { TMDbMovie } from '@/types/tmdb';

export async function fetchRecommendedMovies(
  userId: string
): Promise<TMDbMovie[]> {
  // Query Supabase for watchlists
  const supabase = createClient();
  const { data: watchlists } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', userId);

  if (!watchlists || watchlists.length === 0) {
    return [];
  }

  // Get recommendations (itemId, score)
  const recs = await recommendImplicitMovies(userId, 6);

  // Fetch movie details for each recommended itemId
  const movies = await Promise.all(
    recs.map(async (rec: { itemId: string; score: number }) => {
      const tmdb = await tmdbClient.getMovieDetails(Number(rec.itemId));
      return {
        id: tmdb.id,
        title: tmdb.title,
        poster_path: tmdb.poster_path,
        vote_average: tmdb.vote_average ?? 0,
        release_date: tmdb.release_date ?? '',
        runtime: tmdb.runtime ?? null,
        score: rec.score,
      };
    })
  );

  return movies;
}
