import os
import requests
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
TMDB_API_KEY = os.environ.get("TMDB_API_KEY")
assert SUPABASE_URL and SUPABASE_KEY and TMDB_API_KEY, "Set SUPABASE_URL, SUPABASE_KEY, TMDB_API_KEY in your .env file"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_tmdb_movie(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}"
    params = {"api_key": TMDB_API_KEY, "language": "en-US"}
    resp = requests.get(url, params=params)
    if resp.status_code == 200:
        return resp.json()
    return None

def main():
    # Get all unique movie_ids from watchlists
    watchlists = supabase.table("watchlists").select("movie_id").execute().data
    movie_ids = set([row["movie_id"] for row in watchlists if row.get("movie_id")])
    # Get existing movie_ids in movies table
    existing = supabase.table("movies").select("movie_id").execute().data
    existing_ids = set([row["movie_id"] for row in existing if row.get("movie_id")])
    missing_ids = movie_ids - existing_ids

    print(f"Populating {len(missing_ids)} movies from TMDB...")
    for movie_id in missing_ids:
        tmdb_data = fetch_tmdb_movie(movie_id)
        if tmdb_data:
            supabase.table("movies").insert({
                "movie_id": tmdb_data.get("id"),
                "overview": tmdb_data.get("overview"),
                "title": tmdb_data.get("title"),
                "genres": ", ".join([g["name"] for g in tmdb_data.get("genres", [])]),
                "release_date": tmdb_data.get("release_date"),
                "poster_path": tmdb_data.get("poster_path"),
                "tmdb_data": str(tmdb_data),
                "created_at": pd.Timestamp.now().isoformat(),
                "updated_at": pd.Timestamp.now().isoformat()
            }).execute()
            print(f"Inserted movie {movie_id}")
        else:
            print(f"Failed to fetch movie {movie_id}")

if __name__ == "__main__":
    main()