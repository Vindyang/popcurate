import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
AI_API_KEY = os.environ.get("AI_API_KEY")

assert SUPABASE_URL and SUPABASE_KEY, "Set SUPABASE_URL and SUPABASE_KEY in your .env file"
assert AI_API_KEY, "Set AI_API_KEY in your .env file"

# Configure Gemini
genai.configure(api_key=AI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# Connect to Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_movie_details(movie_id: int):
    """Fetch movie details from Supabase."""
    response = supabase.table("movies").select("*").eq("movie_id", movie_id).execute()
    if response.data and len(response.data) > 0:
        return response.data[0]
    return None


def get_user_watchlist_titles(user_id: str):
    """Get titles of movies in user's watchlist."""
    response = supabase.table("watchlists").select("movie_id").eq("user_id", user_id).execute()
    watchlist_ids = [w['movie_id'] for w in response.data] if response.data else []

    titles = []
    for movie_id in watchlist_ids[:10]:  # Limit to last 10
        movie = get_movie_details(movie_id)
        if movie and movie.get('title'):
            titles.append(movie['title'])

    return titles


def enhance_recommendations(user_id: str, raw_recommendations: list, top_n: int = 20):
    """
    Use Gemini to re-rank and filter recommendations.

    Args:
        user_id: User ID
        raw_recommendations: List of recommendations from ALS/TF-IDF with scores
        top_n: Number of recommendations to return

    Returns:
        List of enhanced recommendations with Gemini scores and match reasons
    """
    # Get user's watchlist
    watchlist_titles = get_user_watchlist_titles(user_id)

    if not watchlist_titles:
        # No watchlist, return raw recommendations
        return raw_recommendations[:top_n]

    # Build candidates list with details
    candidates = []
    for rec in raw_recommendations[:50]:  # Analyze top 50 from ALS
        movie = get_movie_details(int(rec['itemId']))
        if movie:
            candidates.append({
                'id': rec['itemId'],
                'title': movie.get('title', 'Unknown'),
                'overview': (movie.get('overview', '')[:150] + '...') if movie.get('overview') else '',
                'genres': movie.get('genres', ''),
                'als_score': rec['score']
            })

    if not candidates:
        return raw_recommendations[:top_n]

    # Build Gemini prompt
    prompt = f"""You are a movie recommendation expert. Analyze these movie recommendations.

User's watched and liked movies:
{', '.join(watchlist_titles)}

Candidate recommendations (from collaborative filtering):
{json.dumps(candidates[:30], indent=2)}

Task: Re-rank these movies and return ONLY top {top_n} most relevant ones.

For each recommended movie, provide:
1. relevance_score (0.0 to 1.0) - how well it matches user's taste
2. matched_movie - ONE movie from user's watchlist that is most similar (title only)

Rules:
- Ensure diversity (different genres, themes, years)
- Avoid recommending very similar movies
- Higher relevance for thematic matches
- Consider genres, mood, style, themes

Return ONLY valid JSON array (no markdown, no explanation):
[
  {{"movie_id": "123", "relevance_score": 0.95, "matched_movie": "Movie Title"}},
  ...
]
"""

    try:
        # Call Gemini
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Clean response (remove markdown if present)
        if response_text.startswith('```'):
            response_text = response_text.split('```')[1]
            if response_text.startswith('json'):
                response_text = response_text[4:]

        gemini_results = json.loads(response_text)

        # Hybrid scoring: 50% ALS, 50% Gemini
        enhanced = []
        for gemini_rec in gemini_results:
            movie_id = gemini_rec['movie_id']
            gemini_score = gemini_rec['relevance_score']
            matched_movie = gemini_rec.get('matched_movie', watchlist_titles[0])

            # Find original ALS score
            als_score = 0.0
            for rec in raw_recommendations:
                if rec['itemId'] == movie_id:
                    als_score = rec['score']
                    break

            # Normalize ALS score (assume max is 1.0)
            als_normalized = min(als_score, 1.0)

            # Hybrid score: 50% ALS + 50% Gemini
            hybrid_score = 0.5 * als_normalized + 0.5 * gemini_score

            enhanced.append({
                'itemId': movie_id,
                'score': hybrid_score,
                'als_score': als_score,
                'gemini_score': gemini_score,
                'matched_movie': matched_movie
            })

        # Sort by hybrid score
        enhanced.sort(key=lambda x: x['score'], reverse=True)
        return enhanced[:top_n]

    except Exception as e:
        print(f"Gemini enhancement failed: {e}")
        # Fallback to original recommendations
        return raw_recommendations[:top_n]


def enhance_all_user_recommendations():
    """Enhance recommendations for all users with existing rec files."""
    recs_dir = "data/recs"

    if not os.path.exists(recs_dir):
        print("No recommendations directory found. Run train_implicit_model.py first.")
        return

    for filename in os.listdir(recs_dir):
        if filename.endswith('.json'):
            user_id = filename.replace('.json', '')
            print(f"Enhancing recommendations for user: {user_id}")

            # Load raw recommendations
            with open(os.path.join(recs_dir, filename), 'r') as f:
                raw_recs = json.load(f)

            # Enhance with Gemini
            enhanced_recs = enhance_recommendations(user_id, raw_recs, top_n=20)

            # Save enhanced recommendations
            output_file = os.path.join(recs_dir, f"{user_id}_enhanced.json")
            with open(output_file, 'w') as f:
                json.dump(enhanced_recs, f, indent=2)

            print(f"  ✓ Saved enhanced recommendations to {output_file}")


if __name__ == "__main__":
    enhance_all_user_recommendations()
