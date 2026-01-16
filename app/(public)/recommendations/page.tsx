'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/betterauth/auth-client';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/movie/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowPathIcon,
  SparklesIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import type { TMDbMovie } from '@/types/tmdb';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RecommendationsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [recommendations, setRecommendations] = useState<TMDbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);

  const fetchRecommendations = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/recommendations/${session.user.id}?limit=${limit}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      if (data.message) {
        setError(data.message);
        setRecommendations([]);
      } else {
        setRecommendations(data.recommendations || []);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load recommendations'
      );
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, limit]);

  useEffect(() => {
    // Wait for session to load before checking auth
    if (isPending) return;

    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    fetchRecommendations();
  }, [session, limit, isPending, router, fetchRecommendations]);

  // Show loading while checking auth
  if (isPending) {
    return (
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <SparklesIcon className="text-primary h-8 w-8" />
            <h1 className="text-3xl font-bold">Your Recommendations</h1>
          </div>
          <p className="text-muted-foreground">
            Personalized movie suggestions based on your watchlists
          </p>
        </div>
        <Button
          onClick={fetchRecommendations}
          variant="outline"
          disabled={loading}
        >
          <ArrowPathIcon
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* Controls */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <label className="text-sm font-medium whitespace-nowrap">
            Number of recommendations:
          </label>
          <Select
            value={String(limit)}
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 movies</SelectItem>
              <SelectItem value="20">20 movies</SelectItem>
              <SelectItem value="30">30 movies</SelectItem>
              <SelectItem value="50">50 movies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="mb-6 p-6">
          <div className="text-center">
            <BookmarkIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h2 className="mb-2 text-xl font-semibold">
              No Recommendations Yet
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            {error.includes('Add movies') && (
              <Button onClick={() => router.push('/')}>Browse Movies</Button>
            )}
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {recommendations.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              size="md"
              showRating={true}
              showYear={true}
            />
          ))}
        </div>
      )}

      {/* Empty State (after loading, no error, but no results) */}
      {!loading && !error && recommendations.length === 0 && (
        <Card className="p-6">
          <div className="text-center">
            <SparklesIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h2 className="mb-2 text-xl font-semibold">
              No Recommendations Available
            </h2>
            <p className="text-muted-foreground mb-4">
              Add more movies to your watchlist to get personalized
              recommendations!
            </p>
            <Button onClick={() => router.push('/watchlists')}>
              View Watchlists
            </Button>
          </div>
        </Card>
      )}
    </main>
  );
}
