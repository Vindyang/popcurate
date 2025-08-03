import { Button } from '@/components/ui/button';
import { FireIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function TrendingPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-orange-500/20 p-2">
            <FireIcon className="h-6 w-6 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Trending Movies</h1>
        </div>
        <p className="text-muted-foreground">
          The most popular movies trending right now across the globe.
        </p>
      </div>

      {/* Time Period Selector */}
      <div className="mb-8 flex gap-2">
        <Button variant="default" size="sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          This Week
        </Button>
        <Button variant="outline" size="sm">
          Today
        </Button>
      </div>

      {/* Trending Movies Grid - Placeholder */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="group cursor-pointer">
            {/* Movie Poster Placeholder */}
            <div className="bg-muted relative mb-3 aspect-[2/3] overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute right-4 bottom-4 left-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="text-sm font-medium">Movie Title {i + 1}</div>
                <div className="text-xs text-white/80">2024</div>
              </div>
              {/* Trending Rank */}
              <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {i + 1}
              </div>
            </div>

            {/* Movie Info */}
            <div className="space-y-1">
              <h3 className="line-clamp-2 text-sm font-medium">
                Sample Movie Title {i + 1}
              </h3>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>2024</span>
                <span>•</span>
                <span>⭐ 8.{Math.floor(Math.random() * 10)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg">
          Load More Movies
        </Button>
      </div>
    </div>
  );
}
