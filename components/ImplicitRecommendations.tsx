'use client';
import { Card } from './ui/card';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  score: number;
};

interface ImplicitRecommendationsProps {
  movies: Movie[];
}

export default function ImplicitRecommendations({
  movies,
}: ImplicitRecommendationsProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No recommendations available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {movies.map((m) => (
        <Card key={m.id} className="flex flex-col items-center p-4">
          <img
            src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
            alt={m.title}
            className="mb-2 h-60 w-40 rounded-lg object-cover"
            loading="lazy"
            width={160}
            height={240}
          />
          <div className="text-lg font-semibold">{m.title}</div>
          <div className="text-muted-foreground text-xs">
            Score: {m.score.toFixed(2)}
          </div>
        </Card>
      ))}
    </div>
  );
}
