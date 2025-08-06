'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/movie/search-bar';
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  FilmIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

import { useEffect, useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamically set highlight color based on theme
  const highlightColor =
    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200';

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
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className={`group focus-visible:ring-primary cursor-pointer transition-colors focus-visible:ring-2 ${highlightColor}`}
            >
              {theme === 'dark' ? (
                <MoonIcon className="text-primary h-5 w-5 transition-colors" />
              ) : (
                <SunIcon className="text-primary h-5 w-5 scale-125 transition-colors" />
              )}
            </Button>
          )}

          {/* User Menu */}
          <Button variant="ghost" size="icon">
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>

          {/* Mobile Search Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="bg-background border-t px-4 py-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
