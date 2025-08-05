'use client';

import { useState, useEffect, useCallback } from 'react';
import { TMDbMovie } from '@/types/tmdb';

interface UseSearchSuggestionsReturn {
  suggestions: TMDbMovie[];
  isLoading: boolean;
  error: string | null;
  clearSuggestions: () => void;
}

export function useSearchSuggestions(
  query: string,
  debounceMs = 300
): UseSearchSuggestionsReturn {
  const [suggestions, setSuggestions] = useState<TMDbMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 1) {
      clearSuggestions();
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/movies/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch suggestions');
        }

        // Limit to first 5 suggestions for better UX
        setSuggestions(data.results?.slice(0, 5) || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch suggestions'
        );
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, clearSuggestions]);

  return {
    suggestions,
    isLoading,
    error,
    clearSuggestions,
  };
}
