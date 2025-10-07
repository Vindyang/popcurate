import os
import json
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
from implicit.als import AlternatingLeastSquares
from scipy.sparse import coo_matrix, csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer

def vectorize_overviews(overviews, min_df=5, max_df=0.5):
    """
    Vectorizes movie overviews using TF-IDF.

    Args:
        overviews (list or pd.Series): List of movie overview strings.
        min_df (int): Minimum document frequency for terms.
        max_df (float): Maximum document frequency for terms.

    Returns:
        tfidf_matrix (scipy.sparse matrix): TF-IDF matrix.
        vectorizer (TfidfVectorizer): Fitted vectorizer object.
    """
    vectorizer = TfidfVectorizer(stop_words='english', min_df=min_df, max_df=max_df)
    tfidf_matrix = vectorizer.fit_transform(overviews)
    return tfidf_matrix, vectorizer

# Load environment variables from .env
load_dotenv()
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
assert SUPABASE_URL and SUPABASE_KEY, "Set SUPABASE_URL and SUPABASE_KEY in your .env file"

# Connect to Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def compute_user_profile_vector(watchlist_ids, tfidf_matrix, item_code_map):
    """
    Computes the user profile vector by averaging TF-IDF vectors of watchlist movies.
    """
    from scipy.sparse import vstack
    vectors = [tfidf_matrix[item_code_map[movie_id]] for movie_id in watchlist_ids if movie_id in item_code_map]
    if not vectors:
        return None
    stacked = vstack(vectors)
    mean_vec = stacked.mean(axis=0)
    return np.asarray(mean_vec).flatten()

def hybrid_score_recommendations(recommended_codes, als_scores, tfidf_matrix, user_profile_vector, alpha=0.7):
    """
    Combines ALS and content similarity scores for hybrid ranking.
    """
    from sklearn.metrics.pairwise import cosine_similarity
    from scipy.sparse import vstack
    candidate_vectors = [tfidf_matrix[rec_code] for rec_code in recommended_codes]
    candidate_matrix = vstack(candidate_vectors)
    user_profile_vector_2d = user_profile_vector.reshape(1, -1)
    content_scores = cosine_similarity(user_profile_vector_2d, candidate_matrix).flatten()
    norm_als_scores = (als_scores - als_scores.min()) / (als_scores.max() - als_scores.min() + 1e-6)
    norm_content_scores = (content_scores - content_scores.min()) / (content_scores.max() - content_scores.min() + 1e-6)
    hybrid_scores = alpha * norm_als_scores + (1 - alpha) * norm_content_scores
    return sorted(zip(recommended_codes, hybrid_scores), key=lambda x: x[1], reverse=True)

if __name__ == "__main__":
    print("=" * 60)
    print("🎬 POPCURATE - AI Recommendation Training")
    print("=" * 60)

    # Fetch watchlist data
    print("\n📊 Step 1: Fetching watchlist data from Supabase...")
    response = supabase.table("watchlists").select("user_id, movie_id").execute()
    watchlists = response.data

    if not watchlists or len(watchlists) < 2:
        raise ValueError("Not enough watchlist data for training. Need at least 2 watchlist entries.")

    df = pd.DataFrame(watchlists)
    unique_users = df["user_id"].nunique()
    unique_movies = df["movie_id"].nunique()
    print(f"   ✓ Found {len(watchlists)} watchlist entries")
    print(f"   ✓ {unique_users} unique users")
    print(f"   ✓ {unique_movies} unique movies")

    # Build user-item matrix
    print("\n🔢 Step 2: Building user-item matrix...")
    user_codes = df["user_id"].astype("category").cat.codes
    item_codes = df["movie_id"].astype("category").cat.codes

    user_map = dict(enumerate(df["user_id"].astype("category").cat.categories))
    item_map = dict(enumerate(df["movie_id"].astype("category").cat.categories))
    item_code_map = {v: k for k, v in item_map.items()}

    from scipy.sparse import coo_matrix, csr_matrix

    matrix = coo_matrix((np.ones(len(df)), (user_codes, item_codes)))
    matrix_csr = matrix.tocsr()
    print(f"   ✓ Matrix shape: {matrix_csr.shape[0]} users × {matrix_csr.shape[1]} movies")

    # Train ALS model
    print("\n🤖 Step 3: Training ALS model (this may take a minute)...")
    model = AlternatingLeastSquares(factors=50, regularization=0.1, iterations=50)
    model.fit(matrix_csr)
    print("   ✓ Model training complete!")

    # Create output directory
    os.makedirs("data/recs", exist_ok=True)

    # --- Example: Fetch movie metadata and vectorize ---
    # response_movies = supabase.table("movies").select("movie_id, overview").in_("movie_id", df["movie_id"].unique().tolist()).execute()
    # movies_df = pd.DataFrame(response_movies.data).dropna(subset=['overview'])
    # movies_df.set_index('movie_id', inplace=True)
    # tfidf_matrix, vectorizer = vectorize_overviews(movies_df.loc[[item_map[i] for i in range(len(item_map))]]['overview'])

    # --- Generate Recommendations for All Users ---
    print("\n🎬 Generating recommendations for all users...")

    for user_idx in range(matrix_csr.shape[0]):
        user_id = user_map[user_idx]
        recommended_codes, als_scores = model.recommend(user_idx, matrix_csr, N=50)

        # Create recommendations list (top 30)
        recs = [{"itemId": str(item_map[i]), "score": float(s)}
                for i, s in zip(recommended_codes, als_scores)][:30]

        # Save to JSON file
        with open(f"data/recs/{user_id}.json", "w") as f:
            json.dump(recs, f)

        print(f"  ✓ User {user_id}: {len(recs)} recommendations saved")

    print(f"\n✅ Success! Generated recommendations for {matrix_csr.shape[0]} users")
    print(f"   Saved to: data/recs/")
    print(f"\n📝 Next steps:")
    print(f"   1. (Optional) Run: python scripts/enhance_with_gemini.py")
    print(f"      → Adds AI re-ranking with 'Because you watched...' explanations")
    print(f"   2. Start your app and visit /recommendations")

    # Note: TF-IDF hybrid scoring is available but disabled for now
    # To enable, uncomment lines 91-94 and modify this loop to use hybrid_score_recommendations()
