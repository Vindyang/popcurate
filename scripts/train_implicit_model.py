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
    # Fetch watchlist data
    response = supabase.table("watchlists").select("user_id, movie_id").execute()
    watchlists = response.data

    if not watchlists or len(watchlists) < 2:
        raise ValueError("Not enough watchlist data for training.")

    df = pd.DataFrame(watchlists)
    user_codes = df["user_id"].astype("category").cat.codes
    item_codes = df["movie_id"].astype("category").cat.codes

    user_map = dict(enumerate(df["user_id"].astype("category").cat.categories))
    item_map = dict(enumerate(df["movie_id"].astype("category").cat.categories))
    item_code_map = {v: k for k, v in item_map.items()}

    from scipy.sparse import coo_matrix, csr_matrix

    matrix = coo_matrix((np.ones(len(df)), (user_codes, item_codes)))
    matrix_csr = matrix.tocsr()

    model = AlternatingLeastSquares(factors=50, regularization=0.1, iterations=50)
    model.fit(matrix_csr)

    os.makedirs("data/recs", exist_ok=True)

    # --- Example: Fetch movie metadata and vectorize ---
    # response_movies = supabase.table("movies").select("movie_id, overview").in_("movie_id", df["movie_id"].unique().tolist()).execute()
    # movies_df = pd.DataFrame(response_movies.data).dropna(subset=['overview'])
    # movies_df.set_index('movie_id', inplace=True)
    # tfidf_matrix, vectorizer = vectorize_overviews(movies_df.loc[[item_map[i] for i in range(len(item_map))]]['overview'])

    # --- Recommendation Loop with Hybrid Scoring ---
    ALPHA = 0.7
    for user_idx in range(matrix_csr.shape[0]):
        user_id = user_map[user_idx]
        recommended_codes, als_scores = model.recommend(user_idx, matrix_csr, N=50)
        user_watchlist_ids = df[df['user_id'] == user_id]['movie_id'].tolist()
        # user_profile_vector = compute_user_profile_vector(user_watchlist_ids, tfidf_matrix, item_code_map)
        # if user_profile_vector is None:
        #     recs = [{"itemId": str(item_map[i]), "score": float(s)} for i, s in zip(recommended_codes, als_scores)][:30]
        # else:
        #     final_recs_with_scores = hybrid_score_recommendations(recommended_codes, als_scores, tfidf_matrix, user_profile_vector, alpha=ALPHA)
        #     recs = [{"itemId": str(item_map[i]), "score": float(s)} for i, s in final_recs_with_scores[:30]]
        # with open(f"data/recs/{user_id}.json", "w") as f:
        #     json.dump(recs, f)
    # Uncomment and integrate above after connecting metadata and TF-IDF modules
