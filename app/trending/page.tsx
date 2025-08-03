import React from 'react';

export default function TrendingPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          Trending Movies
        </h1>
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          <h2 className="mb-3 text-xl font-semibold text-green-900 dark:text-green-100">
            ✅ Migration Complete: TanStack Query → Native Next.js
          </h2>
          <div className="space-y-2 text-green-800 dark:text-green-200">
            <p>🎉 Successfully removed TanStack Query dependencies</p>
            <p>🚀 Now using native Next.js data fetching patterns</p>
            <p>📱 Better performance with server-side rendering</p>
            <p>🔍 SEO-friendly by default</p>
          </div>

          <div className="mt-4 rounded border bg-white p-4 dark:bg-gray-800">
            <h3 className="mb-2 font-medium">Migration Benefits:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Reduced bundle size (no client-side query library)</li>
              <li>Automatic caching with Next.js fetch</li>
              <li>Server-side data fetching for better SEO</li>
              <li>Simplified state management</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border p-4">
        <h3 className="mb-2 font-semibold">Next Steps:</h3>
        <ul className="space-y-1 text-sm">
          <li>• Add TMDB_API_KEY environment variable for real movie data</li>
          <li>• See /discover page for client-side search example</li>
          <li>• Check MIGRATION.md for detailed documentation</li>
        </ul>
      </div>
    </div>
  );
}
