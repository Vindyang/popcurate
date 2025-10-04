# AI-Powered Recommendations Setup

This guide explains how to set up and use the AI-powered movie recommendation system with Gemini enhancement.

## Overview

The system uses a **hybrid approach**:

1. **ALS (Alternating Least Squares)** - Collaborative filtering based on user watchlists
2. **TF-IDF** - Content-based filtering using movie overviews
3. **Gemini AI** - Re-ranks and filters recommendations with semantic understanding

**Final Score**: `0.5 × ALS Score + 0.5 × Gemini Relevance Score`

---

## Prerequisites

1. **Python 3.8+** with pip
2. **Supabase** project with `watchlists` and `movies` tables populated
3. **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **TMDB API Key** (already configured)

---

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `implicit` - ALS collaborative filtering
- `google-generativeai` - Gemini AI SDK
- `scikit-learn` - TF-IDF vectorization
- Other dependencies (pandas, numpy, supabase, etc.)

### 2. Configure Environment Variables

Add to your `.env.local` (or `.env`):

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# TMDB (already configured)
TMDB_API_KEY=your_tmdb_api_key
```

---

## Usage

### Step 1: Populate Movies Table (One-time)

If you haven't already populated the movies table with TMDB metadata:

```bash
python scripts/populate_movies_table.py
```

### Step 2: Train Base Model (ALS + TF-IDF)

Generate initial recommendations using collaborative filtering:

```bash
python scripts/train_implicit_model.py
```

This creates JSON files in `data/recs/` with format: `{userId}.json`

### Step 3: Enhance with Gemini AI

Re-rank recommendations using Gemini for better relevance:

```bash
python scripts/enhance_with_gemini.py
```

This creates enhanced files: `{userId}_enhanced.json`

**Note**: This makes API calls to Gemini, so be mindful of rate limits and costs.

### Step 4: View Recommendations

The app automatically uses enhanced recommendations if available.

1. Start the Next.js app:
   ```bash
   bun dev
   ```

2. Navigate to `/recommendations` or click "For You" in the header

3. You'll see personalized recommendations with "Because you watched..." explanations

---

## How It Works

### 1. Data Flow

```
User Watchlists
    ↓
[ALS Model] → Collaborative filtering scores
    ↓
[TF-IDF] → Content similarity scores
    ↓
[Gemini AI] → Semantic re-ranking + matching
    ↓
Final Recommendations with explanations
```

### 2. Gemini Enhancement

The `enhance_with_gemini.py` script:

1. Fetches user's watchlist titles
2. Gets top 50 candidates from ALS model
3. Sends to Gemini with this prompt:
   - Analyze user's taste based on watchlist
   - Re-rank candidates for relevance (0.0 to 1.0)
   - Match each recommendation to a watchlist movie
   - Ensure diversity (different genres/themes)
4. Combines scores: `0.5 × ALS + 0.5 × Gemini`
5. Saves enhanced recommendations

### 3. Frontend Integration

The recommendation service (`lib/algorithm/ImplicitRecService.ts`):

1. Checks for `{userId}_enhanced.json` first
2. Falls back to `{userId}.json` if not available
3. Filters out already-watched movies
4. Applies genre matching

The API endpoint (`/api/recommendations/[userId]`):

1. Fetches recommendations from service
2. Enriches with TMDB movie details
3. Includes `matched_movie` field from Gemini
4. Supports filtering by genre and limit

The UI displays:

- Movie cards with ratings and year
- "Because you watched {matched_movie}" caption
- Refresh button to reload recommendations
- Number of results control (10, 20, 30, 50)

---

## File Structure

```
popcurate/
├── scripts/
│   ├── train_implicit_model.py      # Base ALS + TF-IDF model
│   ├── enhance_with_gemini.py       # Gemini enhancement
│   └── populate_movies_table.py     # TMDB data population
│
├── data/recs/
│   ├── {userId}.json                # Base recommendations
│   └── {userId}_enhanced.json       # Gemini-enhanced recs
│
├── lib/algorithm/
│   └── ImplicitRecService.ts        # Recommendation service
│
├── app/
│   ├── api/recommendations/[userId]/route.ts  # API endpoint
│   └── (public)/recommendations/page.tsx      # UI page
│
└── components/movie/
    └── movie-card.tsx               # Shows "Because you watched..."
```

---

## Customization

### Adjust Hybrid Scoring Weights

In `scripts/enhance_with_gemini.py`:

```python
# Current: 50% ALS, 50% Gemini
hybrid_score = 0.5 * als_normalized + 0.5 * gemini_score

# Example: 60% ALS, 40% Gemini
hybrid_score = 0.6 * als_normalized + 0.4 * gemini_score
```

### Change Number of Recommendations

In `scripts/enhance_with_gemini.py`:

```python
# Current: Top 20
enhanced_recs = enhance_recommendations(user_id, raw_recs, top_n=20)

# Example: Top 30
enhanced_recs = enhance_recommendations(user_id, raw_recs, top_n=30)
```

### Modify Gemini Prompt

Edit the prompt in `scripts/enhance_with_gemini.py` to change:
- Re-ranking criteria
- Diversity requirements
- Response format

---

## Troubleshooting

### Error: "No recommendations found"

**Solution**: Run the training script first:
```bash
python scripts/train_implicit_model.py
```

### Error: "GEMINI_API_KEY not set"

**Solution**: Add your Gemini API key to `.env.local`:
```env
GEMINI_API_KEY=your_key_here
```

### Gemini API Rate Limit

**Solution**:
- Wait between requests
- Process users in batches
- Use Gemini 1.5 Flash (faster, cheaper)

### Poor Recommendations

**Causes**:
- Not enough watchlist data
- Movies not in TMDB database
- ALS model needs re-training

**Solutions**:
1. Add more movies to watchlist (at least 5-10)
2. Re-train model with updated data
3. Adjust hybrid scoring weights

---

## Performance Tips

1. **Cache Gemini responses** - Store results and update weekly
2. **Batch processing** - Enhance all users at once, not on-demand
3. **Use Gemini 1.5 Flash** - 10x cheaper than Pro, still great results
4. **Set up cron job** - Auto-update recommendations daily/weekly

---

## Cost Estimation

**Gemini 1.5 Flash Pricing** (as of 2024):
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens

**Per user enhancement** (~2,000 tokens total):
- Cost: ~$0.0006 (less than a penny)

**For 1,000 users**:
- Cost: ~$0.60

**Recommendation**: Run batch enhancement weekly or when user adds movies.

---

## Next Steps

### Improvements to Consider:

1. **Real-time enhancement** - Generate on-demand for active users
2. **A/B testing** - Compare ALS-only vs. Gemini-enhanced
3. **User feedback** - Like/dislike to improve recommendations
4. **Seasonal recommendations** - Holiday movies, summer blockbusters
5. **Social recommendations** - "Friends also liked..."

### Advanced Features:

1. **LightFM** - Replace ALS with better cold-start handling
2. **Sentence Transformers** - Semantic movie similarity
3. **Two-tower neural network** - State-of-the-art recommendations
4. **Vector database** - Fast similarity search (Pinecone, Weaviate)

---

## Support

For issues or questions:
- Check [GitHub Issues](https://github.com/Vindyang/popcurate/issues)
- Review [Gemini API Docs](https://ai.google.dev/docs)
- See [implicit library docs](https://implicit.readthedocs.io/)
