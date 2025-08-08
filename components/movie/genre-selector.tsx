'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { MovieCard } from '@/components/movie/movie-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { TMDbGenre, TMDbMovie } from '@/types/tmdb';

interface GenreSelectorProps {
  className?: string;
}

export function GenreSelector({ className }: GenreSelectorProps) {
  const [genres, setGenres] = useState<TMDbGenre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<TMDbGenre[]>([]);
  const [suggestedMovies, setSuggestedMovies] = useState<TMDbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [genresLoading, setGenresLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Fetch genres on component mount
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch('/api/movies/genres');
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setGenresLoading(false);
      }
    }

    fetchGenres();
  }, []);

  // Toggle genre selection
  const toggleGenre = (genre: TMDbGenre) => {
    setSelectedGenres((prev) => {
      const isSelected = prev.some((g) => g.id === genre.id);
      if (isSelected) {
        return prev.filter((g) => g.id !== genre.id);
      } else {
        return [...prev, genre];
      }
    });
  };

  // Fetch movies based on selected genres
  const handleGoClick = async () => {
    if (selectedGenres.length === 0) return;

    setLoading(true);
    setShowDialog(true);
    setCurrentPage(1);
    setSuggestedMovies([]);

    try {
      // Join genre IDs with comma for API call
      const genreIds = selectedGenres.map((g) => g.id).join(',');
      const response = await fetch(
        `/api/movies/discover?genre=${genreIds}&sort_by=popularity.desc&page=1`
      );
      const data = await response.json();
      setSuggestedMovies(data.results || []);
      setHasMorePages(data.total_pages > 1);
    } catch (error) {
      console.error('Error fetching movies for genres:', error);
      setSuggestedMovies([]);
      setHasMorePages(false);
    } finally {
      setLoading(false);
    }
  };

  // Load more movies (next page)
  const loadMoreMovies = async () => {
    if (!hasMorePages || loadingMore) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const genreIds = selectedGenres.map((g) => g.id).join(',');
      const response = await fetch(
        `/api/movies/discover?genre=${genreIds}&sort_by=popularity.desc&page=${nextPage}`
      );
      const data = await response.json();

      // Append new movies to existing ones
      setSuggestedMovies((prev) => [...prev, ...(data.results || [])]);
      setCurrentPage(nextPage);
      setHasMorePages(data.total_pages > nextPage);
    } catch (error) {
      console.error('Error loading more movies:', error);
      setHasMorePages(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // Close dialog
  const closeDialog = () => {
    setShowDialog(false);
    setSuggestedMovies([]);
    setCurrentPage(1);
    setHasMorePages(true);
  };

  // Handle escape key to close dialog
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDialog) {
        closeDialog();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showDialog]);

  if (genresLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h3 className="mb-2 text-xl font-semibold">Find Your Next Movie</h3>
          <p className="text-muted-foreground mb-6">
            Pick genres and discover something amazing to watch
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className={`space-y-6 rounded-xl bg-black shadow-sm ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="mb-2 text-xl font-semibold">Find Your Next Movie</h3>
        <p className="text-muted-foreground mb-6">
          Pick genres and discover something amazing to watch
        </p>
      </div>

      {/* Genre Selection */}
      <div className="space-y-4">
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
          {genres.map((genre) => {
            const isSelected = selectedGenres.some((g) => g.id === genre.id);
            return (
              <Button
                key={genre.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleGenre(genre)}
                className={`rounded-full transition-colors duration-150 ${
                  isSelected
                    ? 'border border-gray-300 bg-white text-black shadow-sm'
                    : ''
                }`}
              >
                {genre.name}
              </Button>
            );
          })}
        </div>

        {/* Go Button */}
        {selectedGenres.length > 0 && (
          <div className="text-center">
            <Button
              onClick={handleGoClick}
              size="lg"
              className="border border-gray-300 bg-white px-8 py-2 text-base font-semibold text-black shadow-sm transition-colors duration-150 hover:bg-gray-100"
            >
              Go ({selectedGenres.length} genre
              {selectedGenres.length > 1 ? 's' : ''})
            </Button>
          </div>
        )}
      </div>

      {/* Dialog Modal */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-opacity-90 max-h-[90vh] max-w-4xl overflow-y-auto bg-black">
          <DialogHeader>
            <DialogTitle>
              {loading
                ? 'Finding Movies...'
                : `Movies for ${selectedGenres.map((g) => g.name).join(', ')}`}
            </DialogTitle>
            <DialogDescription>
              {loading
                ? 'Finding the best picks for you'
                : 'Movies you might enjoy based on your selected genres'}
            </DialogDescription>
          </DialogHeader>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" className="mb-4" />
              <p className="mb-2 text-lg font-medium">
                Finding the best picks for you
              </p>
              <p className="text-muted-foreground text-sm">
                Curating movies from{' '}
                {selectedGenres.map((g) => g.name.toLowerCase()).join(', ')}...
              </p>
            </div>
          )}

          {/* Movie Results */}
          {!loading && suggestedMovies.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="grid max-w-fit grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-4 lg:gap-10">
                  {suggestedMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      size="sm"
                      showRating={true}
                      showYear={true}
                      openInNewTab={true}
                    />
                  ))}
                </div>
              </div>

              {/* Load More Button */}
              {hasMorePages && (
                <div className="text-center">
                  <Button
                    onClick={loadMoreMovies}
                    disabled={loadingMore}
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    {loadingMore ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Loading More...
                      </>
                    ) : (
                      'Load More Movies'
                    )}
                  </Button>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Showing {suggestedMovies.length} movies
                  </p>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {!loading &&
            suggestedMovies.length === 0 &&
            selectedGenres.length > 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No movies found for the selected genres. Try different genres!
                </p>
              </div>
            )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
