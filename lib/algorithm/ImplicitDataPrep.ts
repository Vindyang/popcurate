'use server';

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function exportImplicitData(filePath: string) {
  const { data: watchlists, error } = await supabase
    .from('watchlists')
    .select('user_id, movie_id');

  if (error) throw new Error(`Supabase error: ${error.message}`);
  if (!watchlists || watchlists.length === 0)
    throw new Error('No watchlist data');

  const users = Array.from(new Set(watchlists.map((w) => w.user_id)));
  const items = Array.from(new Set(watchlists.map((w) => String(w.movie_id))));
  const uIndex = new Map(users.map((u, i) => [u, i + 1]));
  const iIndex = new Map(items.map((m, i) => [m, i + 1]));

  const header = `${watchlists.length} ${items.length} ${users.length}\n`;
  const lines = watchlists.map((w) => {
    const u = uIndex.get(w.user_id)!;
    const i = iIndex.get(String(w.movie_id))!;
    return `${u} ${i} 1`;
  });

  fs.writeFileSync(filePath, header + lines.join('\n'));
}
