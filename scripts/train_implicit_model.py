import os
import json
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
from implicit.als import AlternatingLeastSquares
from scipy.sparse import coo_matrix

# Load environment variables from .env
load_dotenv()
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
assert SUPABASE_URL and SUPABASE_KEY, "Set SUPABASE_URL and SUPABASE_KEY in your .env file"

# Connect to Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fetch watchlist data
response = supabase.table("watchlists").select("user_id, movie_id").execute()
watchlists = response.data

if not watchlists or len(watchlists) < 2:
    raise ValueError("Not enough watchlist data for training.")

df = pd.DataFrame(watchlists)
user_codes = df["user_id"].astype("category").cat.codes
item_codes = df["movie_id"].astype("category").cat.codes

from scipy.sparse import coo_matrix, csr_matrix

matrix = coo_matrix((np.ones(len(df)), (user_codes, item_codes)))
matrix_csr = matrix.tocsr()

model = AlternatingLeastSquares(factors=50, regularization=0.1, iterations=50)
model.fit(matrix_csr)

user_map = dict(enumerate(df["user_id"].astype("category").cat.categories))
item_map = dict(enumerate(df["movie_id"].astype("category").cat.categories))

os.makedirs("data/recs", exist_ok=True)
for user_idx in range(matrix_csr.shape[0]):
    recommended, scores = model.recommend(user_idx, matrix_csr, N=30)
    recs = [{"itemId": str(item_map[i]), "score": float(s)} for i, s in zip(recommended, scores)]
    with open(f"data/recs/{user_map[user_idx]}.json", "w") as f:
        json.dump(recs, f)