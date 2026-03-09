'use server';

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { tmdbClient } from '@/lib/tmdb/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function discoverByWatchlistGenres(
  watchedSet: Set<string>,
  watchlistGenres: Set<string>,
  topN: number
): Promise<{ itemId: string; score: number }[]> {
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

  const seen = new Set<string>();
  const fallbackMovies: { itemId: string; score: number }[] = [];
  for (const genreId of genreIds) {
    const discover = await tmdbClient.discoverMovies({
      genre: String(genreId),
      sortBy: 'popularity.desc',
      page: 1,
    });
    for (const m of discover.results as { id: number }[]) {
      const id = String(m.id);
      if (!watchedSet.has(id) && !seen.has(id)) {
        seen.add(id);
        fallbackMovies.push({ itemId: id, score: 0 });
      }
    }
  }
  return fallbackMovies.slice(0, topN);
}

function readRecFile(enhancedPath: string, recPath: string): { itemId: string; score: number }[] | null {
  if (fs.existsSync(enhancedPath)) return JSON.parse(fs.readFileSync(enhancedPath, 'utf8'));
  if (fs.existsSync(recPath)) return JSON.parse(fs.readFileSync(recPath, 'utf8'));
  return null;
}

async function getMovieGenreNames(movieId: number): Promise<string[]> {
  const details = await tmdbClient.getMovieDetails(movieId);
  return details.genres?.map((g: { id: number; name: string }) => g.name) ?? [];
}

export async function recommendImplicitMovies(userId: string, topN = 10) {
  const enhancedPath = path.resolve('data/recs', `${userId}_enhanced.json`);
  const recPath = path.resolve('data/recs', `${userId}.json`);

  // Read rec file once — null means no file exists
  const raw = readRecFile(enhancedPath, recPath);

  // Fetch user's watchlist
  const { data: watchlistMovies, error: wlError } = await supabase
    .from('watchlists')
    .select('movie_id')
    .eq('user_id', userId);

  if (wlError) throw new Error(`Supabase error: ${wlError.message}`);

  const watchedSet = new Set(watchlistMovies?.map((w) => String(w.movie_id)));

  if (watchedSet.size === 0) return [];

  // Fetch genres for watchlist movies from TMDB
  const watchlistGenreSets = await Promise.all(
    Array.from(watchedSet).map((id) => getMovieGenreNames(Number(id)))
  );
  const watchlistGenres = new Set(watchlistGenreSets.flat());

  // No rec file: fall back directly to genre-based discovery
  if (!raw) {
    if (watchlistGenres.size === 0) return [];
    return discoverByWatchlistGenres(watchedSet, watchlistGenres, topN);
  }

  // Deduplicate by itemId keeping highest score, drop non-positive scores
  const seenItems = new Map<string, number>();
  for (const r of raw) {
    if (r.score <= 0) continue;
    const existing = seenItems.get(r.itemId);
    if (existing === undefined || r.score > existing) {
      seenItems.set(r.itemId, r.score);
    }
  }
  const candidates = Array.from(seenItems.entries())
    .map(([itemId, score]) => ({ itemId, score }))
    .sort((a, b) => b.score - a.score)
    .filter((r) => !watchedSet.has(r.itemId));

  if (candidates.length === 0) {
    if (watchlistGenres.size > 0) return discoverByWatchlistGenres(watchedSet, watchlistGenres, topN);
    return [];
  }

  // Fetch genres for candidate movies from TMDB
  const recGenresMap = new Map<string, string[]>();
  await Promise.all(
    candidates.map(async (r) => {
      recGenresMap.set(r.itemId, await getMovieGenreNames(Number(r.itemId)));
    })
  );

  // Prefer genre-matched movies first, then remaining ALS results
  const genreMatchedSet = new Set<string>();
  const genreMatched: typeof candidates = [];
  const remaining: typeof candidates = [];

  for (const r of candidates) {
    const genres = recGenresMap.get(r.itemId) ?? [];
    if (genres.some((g) => watchlistGenres.has(g))) {
      genreMatchedSet.add(r.itemId);
      genreMatched.push(r);
    } else {
      remaining.push(r);
    }
  }

  return [...genreMatched, ...remaining].slice(0, topN);
}
