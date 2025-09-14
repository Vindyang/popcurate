import os
import sys
import numpy as np
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from train_implicit_model import vectorize_overviews, compute_user_profile_vector, hybrid_score_recommendations

def test_vectorize_overviews():
    overviews = [
        "A hero saves the world.",
        "A villain tries to destroy the world.",
        "A hero and villain face off."
    ]
    tfidf_matrix, vectorizer = vectorize_overviews(overviews, min_df=1, max_df=1.0)
    assert tfidf_matrix.shape[0] == 3
    assert hasattr(vectorizer, "transform")

def test_compute_user_profile_vector():
    overviews = [
        "A hero saves the world.",
        "A villain tries to destroy the world.",
        "A hero and villain face off."
    ]
    tfidf_matrix, vectorizer = vectorize_overviews(overviews, min_df=1, max_df=1.0)
    item_code_map = {i: i for i in range(3)}
    watchlist_ids = [0, 2]
    profile = compute_user_profile_vector(watchlist_ids, tfidf_matrix, item_code_map)
    assert profile is not None
    assert isinstance(profile, np.ndarray)

def test_hybrid_score_recommendations():
    overviews = [
        "A hero saves the world.",
        "A villain tries to destroy the world.",
        "A hero and villain face off."
    ]
    tfidf_matrix, vectorizer = vectorize_overviews(overviews, min_df=1, max_df=1.0)
    item_code_map = {i: i for i in range(3)}
    watchlist_ids = [0, 2]
    profile = compute_user_profile_vector(watchlist_ids, tfidf_matrix, item_code_map)
    recommended_codes = np.array([0, 1, 2])
    als_scores = np.array([0.8, 0.5, 0.3])
    results = hybrid_score_recommendations(recommended_codes, als_scores, tfidf_matrix, profile, alpha=0.7)
    assert isinstance(results, list)
    assert len(results) == 3