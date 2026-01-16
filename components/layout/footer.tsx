import Link from 'next/link';
import { FilmIcon } from '@heroicons/react/24/outline';
import { TMDbLogo } from '@/components/ui/tmdb-logo';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Centered Brand Section */}
        <div className="mb-12 space-y-6 text-center">
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center space-x-3"
          >
            <FilmIcon className="text-primary h-8 w-8" />
            <span className="text-primary text-2xl font-bold">Popcurate</span>
          </Link>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Curated popcorn-ready picks, daily. Discover your next favorite
            movie with personalized recommendations.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="mb-12 flex flex-wrap justify-center gap-8">
          <Link
            href="/trending"
            className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors"
          >
            Trending Movies
          </Link>
          <Link
            href="/popular"
            className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors"
          >
            Popular Movies
          </Link>
          <Link
            href="/top-rated"
            className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors"
          >
            Top Rated
          </Link>
          <Link
            href="/now-playing"
            className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors"
          >
            Now Playing
          </Link>
          <Link
            href="/upcoming"
            className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors"
          >
            Upcoming Movies
          </Link>
          <Link
            href="/watchlists"
            className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors"
          >
            Watchlists
          </Link>
          <Link
            href="/profile"
            className="text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-colors"
          >
            Profile
          </Link>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Attribution */}
            <div className="text-muted-foreground flex flex-col items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span>Powered by</span>
                <Link
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                >
                  <TMDbLogo className="h-5 w-auto" />
                </Link>
              </div>
              <p>© 2025 Popcurate. All rights reserved.</p>
            </div>

            {/* Made with love */}
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>Made by</span>
              <Link
                href="https://github.com/Vindyang"
                className="hover:text-foreground cursor-pointer underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vindyang
              </Link>
              <span>for movie lovers 🍿</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
