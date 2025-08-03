export interface User {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genres: string[];
  created_at: string;
  updated_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  movies?: WatchlistMovie[];
  user?: User;
}

export interface WatchlistMovie {
  id: string;
  watchlist_id: string;
  movie_id: number;
  added_at: string;
  notes: string | null;
  movie?: Movie;
}

export interface Review {
  id: string;
  user_id: string;
  movie_id: number;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  movie?: Movie;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  follower?: User;
  following?: User;
}

export interface MovieRecommendation {
  movie: Movie;
  score: number;
  reason: string;
  type: 'similar' | 'popular' | 'trending' | 'ai' | 'social';
}

export interface UserPreferences {
  favorite_genres: string[];
  disliked_genres: string[];
  preferred_decade: string | null;
  min_rating: number;
  max_runtime: number | null;
  include_adult: boolean;
}
