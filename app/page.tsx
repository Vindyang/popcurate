import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  FilmIcon,
  StarIcon,
  PlayIcon,
  UsersIcon,
  SparklesIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background gradient */}
        <div className="from-primary/10 via-background to-secondary/10 absolute inset-0 bg-gradient-to-br" />

        <div className="relative container mx-auto max-w-6xl px-4">
          <div className="space-y-8 text-center">
            {/* Hero Content */}
            <div className="space-y-4">
              <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
                <SparklesIcon className="h-4 w-4" />
                Powered by AI Recommendations
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-primary">Popcurate</span>
                <br />
                <span className="text-muted-foreground">
                  Your Movie Journey
                </span>
              </h1>

              <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
                Discover your next favorite movie with personalized AI-powered
                recommendations. Create watchlists, connect with fellow
                cinephiles, and never run out of great movies to watch.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="px-8 py-6 text-lg">
                <Link href="/discover">
                  <PlayIcon className="mr-2 h-5 w-5" />
                  Start Discovering
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg"
              >
                <Link href="/trending">
                  <FilmIcon className="mr-2 h-5 w-5" />
                  Browse Trending
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="space-y-2">
                <div className="text-primary text-3xl font-bold">1M+</div>
                <div className="text-muted-foreground text-sm">
                  Movies Available
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-primary text-3xl font-bold">50K+</div>
                <div className="text-muted-foreground text-sm">
                  Active Users
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-primary text-3xl font-bold">100K+</div>
                <div className="text-muted-foreground text-sm">
                  Watchlists Created
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-primary text-3xl font-bold">4.9</div>
                <div className="text-muted-foreground text-sm">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for your movie journey
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              From personalized recommendations to social features, Popcurate
              has everything you need to discover, organize, and share your love
              for movies.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group bg-background relative rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <SparklesIcon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">AI Recommendations</h3>
              </div>
              <p className="text-muted-foreground">
                Get personalized movie suggestions powered by advanced AI that
                learns from your preferences and viewing history.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-background relative rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <BookmarkIcon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Smart Watchlists</h3>
              </div>
              <p className="text-muted-foreground">
                Create and organize multiple watchlists with custom categories,
                notes, and sharing options.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-background relative rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <UsersIcon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Social Features</h3>
              </div>
              <p className="text-muted-foreground">
                Follow friends, share recommendations, and discover what others
                are watching in real-time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-background relative rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <StarIcon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Reviews & Ratings</h3>
              </div>
              <p className="text-muted-foreground">
                Rate movies, write detailed reviews, and see what the community
                thinks about your favorites.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-background relative rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <FilmIcon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">
                  Comprehensive Database
                </h3>
              </div>
              <p className="text-muted-foreground">
                Access detailed information about millions of movies, including
                cast, crew, trailers, and streaming availability.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-background relative rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <PlayIcon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Legal Streaming</h3>
              </div>
              <p className="text-muted-foreground">
                Find where to watch movies legally across different streaming
                platforms and discover public domain classics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to discover your next favorite movie?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of movie enthusiasts who have already discovered
              their perfect matches.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="px-8 py-6 text-lg">
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
