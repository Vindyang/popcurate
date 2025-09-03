Here is the complete content of the new implementation instruction file, named **implicit-mf-setup.md**, which covers building an implicit-feedback matrix factorization system using your existing watchlists table and your current stack:

---

# Implicit Matrix Factorization Setup

This file contains all steps and code snippets for implementing an **implicit-feedback** matrix factorization recommendation system in your Next.js + Supabase + Drizzle-ORM application using only your existing `watchlists` table.

## 1. Install Required Packages

```bash
npm install libmf @supabase/supabase-js drizzle-orm node-fetch
```

## 2. Data Preparation Service

Create `services/ImplicitDataPrep.ts` to export watchlist interactions:

```ts
// services/ImplicitDataPrep.ts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

export class ImplicitDataPrep {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  async exportData(filePath: string) {
    const { data: watchlists } = await this.supabase
      .from('watchlists')
      .select('user_id, movie_id');

    if (!watchlists) throw new Error('No watchlist data');

    const users = Array.from(new Set(watchlists.map((w) => w.user_id)));
    const items = Array.from(
      new Set(watchlists.map((w) => String(w.movie_id)))
    );
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
}
```

## 3. Model Training Script

Create `scripts/trainImplicitModel.ts`:

```ts
import path from 'path';
import { ImplicitDataPrep } from '../services/ImplicitDataPrep';
import { libmf } from 'libmf';

async function train() {
  const dataFile = path.resolve('data/implicit.libmf');
  const modelFile = path.resolve('models/implicit.bin');

  await new ImplicitDataPrep().exportData(dataFile);

  await libmf.train({
    train: dataFile,
    method: 'als',
    k: 50,
    lambda: 0.1,
    niters: 50,
    model: modelFile,
  });
}

train().catch(console.error);
```

Add to your `package.json` scripts section:

```json
"scripts": {
  "train:implicit": "ts-node scripts/trainImplicitModel.ts"
}
```

## 4. Recommendation Service

Create `services/ImplicitRecService.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
import { libmf } from 'libmf';

export class ImplicitRecService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  async recommend(userId: string, topN = 10) {
    const raw = await libmf.predict({
      model: 'models/implicit.bin',
      topn: topN * 3,
      query: userId,
    });

    const { data: watched } = await this.supabase
      .from('watchlists')
      .select('movie_id')
      .eq('user_id', userId);
    const watchedSet = new Set(watched?.map((w) => w.movie_id));

    return raw.filter((r) => !watchedSet.has(r.itemId)).slice(0, topN);
  }
}
```

## 5. API Endpoint

Create `pages/api/implicit-recs/[userId].ts`:

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { ImplicitRecService } from '../../../services/ImplicitRecService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;
  if (!userId || Array.isArray(userId))
    return res.status(400).json({ error: 'Invalid userId' });

  try {
    const service = new ImplicitRecService();
    const recs = await service.recommend(userId);

    const movies = await Promise.all(
      recs.map((r) =>
        fetch(
          `https://api.themoviedb.org/3/movie/${r.itemId}?api_key=${process.env.TMDB_KEY}`
        )
          .then((res) => res.json())
          .then((data) => ({ ...data, score: r.score }))
      )
    );

    res.status(200).json({ recommendations: movies });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
}
```

## 6. Frontend Component

Create `components/ImplicitRecommendations.tsx`:

```tsx
import { Card, Grid } from 'shadcn/ui';

type Movie = { id: number; title: string; poster_path: string; score: number };

export default function ImplicitRecommendations({
  movies,
}: {
  movies: Movie[];
}) {
  return (
    <Grid cols={2} gap="4">
      {movies.map((m) => (
        <Card key={m.id}>
          <img
            src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
            alt={m.title}
          />
          <Card.Header>{m.title}</Card.Header>
          <Card.Body>Score: {m.score.toFixed(2)}</Card.Body>
        </Card>
      ))}
    </Grid>
  );
}
```

## 7. Usage

1. Train the model with:

   ```bash
   npm run train:implicit
   ```

2. Start Next.js server:

   ```bash
   npm run dev
   ```

3. Fetch recommendations via:

   ```
   GET /api/implicit-recs/{userId}
   ```

4. Render recommendations with the `<ImplicitRecommendations />` component.

---

This document can be saved as `implicit-mf-setup.md` and directly passed to coding tools or models for automated implementation of matrix factorization in your app.
