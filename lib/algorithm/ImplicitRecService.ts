'use server';

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { tmdbClient } from '@/lib/tmdb/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function recommendImplicitMovies(userId: string, topN = 10) {
  // Read recommendations from Python output (JSON)
  const recPath = path.resolve('data/recs', `${userId}.json`);
  if (!fs.existsSync(recPath))
    throw new Error('No recommendations found for user');
  const raw = JSON.parse(fs.readFileSync(recPath, 'utf8'));

  // Fetch user's watchlist movies and their genres
  const { data: watchlistMovies, error: wlError } = await supabase
    .from('watchlists')
    .select('movie_id')
    .eq('user_id', userId);

  if (wlError) throw new Error(`Supabase error: ${wlError.message}`);

  const watchedSet = new Set(watchlistMovies?.map((w) => String(w.movie_id)));

  // Fetch genres for watchlist movies from TMDB
  const watchlistGenreSets = await Promise.all(
    Array.from(watchedSet).map(async (id: string | number) => {
      const details = await tmdbClient.getMovieDetails(Number(id));
      return (
        details.genres?.map((g: { id: number; name: string }) => g.name) ?? []
      );
    })
  );
  const watchlistGenres = new Set(watchlistGenreSets.flat());

  // Fetch genres for recommended movies from TMDB
  const recGenresMap = new Map<string, string[]>();
  await Promise.all(
    raw.map(async (r: { itemId: string }) => {
      const details = await tmdbClient.getMovieDetails(Number(r.itemId));
      recGenresMap.set(
        r.itemId,
        details.genres?.map((g: { id: number; name: string }) => g.name) ?? []
      );
    })
  );

  // Filter: not in watchlist AND shares at least one genre
  const filtered = raw.filter((r: { itemId: string }) => {
    if (watchedSet.has(String(r.itemId))) return false;
    const genres = recGenresMap.get(r.itemId) ?? [];
    return genres.some((g: string) => watchlistGenres.has(g));
  });

  if (filtered.length === 0 && watchlistGenres.size > 0) {
    // Fallback: discover movies by user's watchlist genres
    const genreNames = Array.from(watchlistGenres);
    const genreResponse = await tmdbClient.getGenres();
    const genreIds = genreNames
      .map((name) => {
        const genre = genreResponse.genres.find(
          (g: { name: string }) => g.name === name
        );
        return genre?.id;
      })
      .filter(Boolean);

    // Fetch movies for each genre, exclude watched
    let fallbackMovies: { itemId: string; score: number }[] = [];
    for (const genreId of genreIds) {
      const discover = await tmdbClient.discoverMovies({
        genre: String(genreId),
        sortBy: 'popularity.desc',
        page: 1,
      });
      fallbackMovies.push(
        ...discover.results
          .filter((m: { id: number }) => !watchedSet.has(String(m.id)))
          .map((m: { id: number }) => ({ itemId: String(m.id), score: 0 }))
      );
    }
    // Remove duplicates
    const seen = new Set();
    fallbackMovies = fallbackMovies.filter((m) => {
      if (seen.has(m.itemId)) return false;
      seen.add(m.itemId);
      return true;
    });
    return fallbackMovies.slice(0, topN);
  }

  return filtered.slice(0, topN);
}
