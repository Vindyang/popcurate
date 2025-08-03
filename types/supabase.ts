export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      movies: {
        Row: {
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
        };
        Insert: {
          id?: number;
          tmdb_id: number;
          title: string;
          overview?: string | null;
          poster_path?: string | null;
          backdrop_path?: string | null;
          release_date?: string | null;
          runtime?: number | null;
          vote_average?: number;
          vote_count?: number;
          popularity?: number;
          adult?: boolean;
          genres?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          tmdb_id?: number;
          title?: string;
          overview?: string | null;
          poster_path?: string | null;
          backdrop_path?: string | null;
          release_date?: string | null;
          runtime?: number | null;
          vote_average?: number;
          vote_count?: number;
          popularity?: number;
          adult?: boolean;
          genres?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      watchlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      watchlist_movies: {
        Row: {
          id: string;
          watchlist_id: string;
          movie_id: number;
          added_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          watchlist_id: string;
          movie_id: number;
          added_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          watchlist_id?: string;
          movie_id?: number;
          added_at?: string;
          notes?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          movie_id: number;
          rating: number;
          review_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: number;
          rating: number;
          review_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: number;
          rating?: number;
          review_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
