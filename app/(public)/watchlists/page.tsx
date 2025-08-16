// app/(public)/watchlists/page.tsx

import { Suspense } from 'react';
import { Watchlists } from './components/watchlists';

export default function WatchlistsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Watchlists</h1>
      <Suspense fallback={<div>Loading watchlists...</div>}>
        <Watchlists />
      </Suspense>
    </main>
  );
}
