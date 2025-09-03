import pandas as pd
import numpy as np
import json
import os
from implicit.als import AlternatingLeastSquares

# Load data
data = pd.read_csv('data/implicit.csv')  # expects columns: user_id,movie_id
user_ids = data['user_id'].astype('category').cat.codes
item_ids = data['movie_id'].astype('category').cat.codes

# Build sparse matrix
from scipy.sparse import coo_matrix
matrix = coo_matrix((np.ones(len(data)), (user_ids, item_ids)))

# Train ALS model
model = AlternatingLeastSquares(factors=50, regularization=0.1, iterations=50)
model.fit(matrix)

# Map back to original IDs
user_map = dict(enumerate(data['user_id'].astype('category').cat.categories))
item_map = dict(enumerate(data['movie_id'].astype('category').cat.categories))

# Generate recommendations for each user
os.makedirs('data/recs', exist_ok=True)
for user_idx in range(matrix.shape[0]):
    recommended, scores = model.recommend(user_idx, matrix, N=30)
    recs = [{'itemId': str(item_map[i]), 'score': float(s)} for i, s in zip(recommended, scores)]
    with open(f'data/recs/{user_map[user_idx]}.json', 'w') as f:
        json.dump(recs, f)