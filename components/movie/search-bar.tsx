'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SearchSuggestions } from '@/components/movie/search-suggestions';
import { useSearchSuggestions } from '@/lib/hooks/useSearchSuggestions';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearchSubmit?: (query: string) => void;
}

export function SearchBar({
  placeholder = 'Search movies...',
  className = '',
  onSearchSubmit,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { suggestions, isLoading, error, clearSuggestions } =
    useSearchSuggestions(searchQuery);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show suggestions when there's a query and input is focused
  useEffect(() => {
    const shouldShow =
      searchQuery.length >= 1 &&
      (suggestions.length > 0 || isLoading || !!error);
    setShowSuggestions(shouldShow);
  }, [searchQuery, suggestions.length, isLoading, error]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      clearSuggestions();

      if (onSearchSubmit) {
        onSearchSubmit(searchQuery.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchQuery.length >= 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setSearchQuery('');
    clearSuggestions();
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="relative w-full">
          <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="pr-4 pl-10"
            autoComplete="off"
          />
        </div>
      </form>

      {showSuggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          isLoading={isLoading}
          error={error}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
}
