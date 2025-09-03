'use server';

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function recommendImplicitMovies(userId: string, topN = 10) {
  // Read recommendations from Python output (JSON)
  const recPath = path.resolve('data/recs', `${userId}.json`);
  if (!fs.existsSync(recPath))
    throw new Error('No recommendations found for user');
  const raw = JSON.parse(fs.readFileSync(recPath, 'utf8'));

  const { data: watched, error } = await supabase
    .from('watchlists')
    .select('movie_id')
    .eq('user_id', userId);

  if (error) throw new Error(`Supabase error: ${error.message}`);

  const watchedSet = new Set(watched?.map((w) => w.movie_id));
  return raw
    .filter((r: { itemId: string }) => !watchedSet.has(r.itemId))
    .slice(0, topN);
}
