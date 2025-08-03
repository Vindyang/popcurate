import Link from 'next/link';
import { FilmIcon, HeartIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <FilmIcon className="text-primary h-6 w-6" />
              <span className="text-primary text-lg font-bold">Popcurate</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Curated popcorn-ready picks, daily. Discover your next favorite
              movie with personalized recommendations.
            </p>
          </div>

          {/* Discover */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Discover</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/trending"
                  className="hover:text-foreground transition-colors"
                >
                  Trending Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/popular"
                  className="hover:text-foreground transition-colors"
                >
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/top-rated"
                  className="hover:text-foreground transition-colors"
                >
                  Top Rated
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming"
                  className="hover:text-foreground transition-colors"
                >
                  Upcoming Movies
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Community</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/watchlists"
                  className="hover:text-foreground transition-colors"
                >
                  Watchlists
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="hover:text-foreground transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className="hover:text-foreground transition-colors"
                >
                  Find Users
                </Link>
              </li>
              <li>
                <Link
                  href="/discussions"
                  className="hover:text-foreground transition-colors"
                >
                  Discussions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Attribution */}
            <div className="text-muted-foreground flex flex-col items-center gap-2 text-xs md:flex-row md:gap-4">
              <p>© 2025 Popcurate. All rights reserved.</p>
              <p className="flex items-center gap-1">
                <span>
                  This product uses the TMDb API but is not endorsed or
                  certified by TMDb
                </span>
                <GlobeAltIcon className="h-3 w-3" />
              </p>
            </div>

            {/* Made with love */}
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <span>Made with</span>
              <HeartIcon className="h-3 w-3 text-red-500" />
              <span>for movie lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
