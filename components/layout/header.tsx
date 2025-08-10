// Header (Server Component) - Next.js App Router best-practice

import Link from 'next/link';
import { FilmIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import UserProfileServer from '@/components/auth/user-profile-server';
import ThemeToggle from '@/components/layout/theme-toggle-client';
import { SearchBar } from '@/components/movie/search-bar';

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <FilmIcon className="text-primary h-8 w-8" />
          <span className="text-primary text-2xl font-bold">Popcurate</span>
        </Link>

        {/* Search Bar */}
        <SearchBar className="mx-8 hidden max-w-md flex-1 md:block" />

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/watchlists"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              <BookmarkIcon className="mr-1 inline h-4 w-4" />
              My Lists
            </Link>
            <Link
              href="/trending"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/top-rated"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Top Rated
            </Link>
          </nav>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile (server session fetch) */}
          <UserProfileServer />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="bg-background border-t px-4 py-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
