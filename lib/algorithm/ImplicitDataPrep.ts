'use server';

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function exportImplicitData(filePath: string) {
  // fetch watchlist data from Supabase
  const { data: watchlists, error } = await supabase
    .from('watchlists')
    .select('user_id, movie_id');

  if (error) throw new Error(`Supabase error: ${error.message}`);
  if (!watchlists || watchlists.length === 0)
    throw new Error('No watchlist data');

  // map user_ids and movie_ids to sequential integers starting from 1
  const users = Array.from(new Set(watchlists.map((w) => w.user_id)));
  const items = Array.from(new Set(watchlists.map((w) => String(w.movie_id))));
  const uIndex = new Map(users.map((u, i) => [u, i + 1]));
  const iIndex = new Map(items.map((m, i) => [m, i + 1]));

  // write to file in the format:
  // <num_interactions> <num_items> <num_users>
  // <user_index> <item_index> <rating>
  const header = `${watchlists.length} ${items.length} ${users.length}\n`;
  // each interaction has an implicit rating of 1
  const lines = watchlists.map((w) => {
    const u = uIndex.get(w.user_id)!;
    const i = iIndex.get(String(w.movie_id))!;
    // implicit rating of 1
    return `${u} ${i} 1`;
  });
  // resulting file example:
  // 100 50 20        <-- 100 entries, 50 movies, 20 users
  // 1 5 1            <-- User #1 added Movie #5
  // 1 12 1           <-- User #1 added Movie #12
  // 2 5 1            <-- User #2 added Movie #5

  // implicit rating of 1 for all entries because the script uses implicit Alternating Least Squares library

  fs.writeFileSync(filePath, header + lines.join('\n'));
}
