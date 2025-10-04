# Quick Start: AI Recommendations

Get your personalized movie recommendations running in 5 minutes! 🚀

## Prerequisites

- ✅ App is already running (`bun dev`)
- ✅ User account created
- ✅ At least 3-5 movies added to watchlist

## Step 1: Get Gemini API Key (2 minutes)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

## Step 2: Configure Environment (1 minute)

Add to your `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Step 3: Install Python Dependencies (1 minute)

```bash
pip install -r requirements.txt
```

## Step 4: Generate Recommendations (1 minute)

### Option A: With Gemini AI (Recommended) ⭐

```bash
# Generate base recommendations
python scripts/train_implicit_model.py

# Enhance with Gemini AI
python scripts/enhance_with_gemini.py
```

### Option B: Without Gemini (Faster)

```bash
# Just base recommendations
python scripts/train_implicit_model.py
```

## Step 5: View Your Recommendations! 🎉

1. Open your browser to `http://localhost:3000`
2. Click **"For You"** in the navigation
3. See your personalized recommendations with "Because you watched..." explanations

---

## What You'll See

### With Gemini AI:
```
🎬 Inception
⭐ 8.8
Because you watched Interstellar
```

### Without Gemini:
```
🎬 Inception
⭐ 8.8
```

---

## Troubleshooting

### "No recommendations found"

**Solution**: Make sure you ran the training script:
```bash
python scripts/train_implicit_model.py
```

### "Add movies to watchlist first"

**Solution**:
1. Go to home page
2. Browse movies
3. Click the bookmark icon on at least 5 movies

### "Gemini API error"

**Solution**:
- Check your API key in `.env.local`
- Verify you have Gemini API enabled
- Try without Gemini (skip `enhance_with_gemini.py`)

---

## How It Works (Simple Explanation)

1. **You add movies to watchlist** → System learns your taste
2. **ALS algorithm** → Finds similar users and their favorites
3. **TF-IDF** → Matches movies by plot/description
4. **Gemini AI** → Re-ranks for better relevance
5. **You get recommendations** → With "Because you watched..." explanations

---

## Next Steps

- **Refresh recommendations**: Click the refresh button
- **Adjust count**: Select 10, 20, 30, or 50 movies
- **Update regularly**: Re-run scripts when you add movies
- **Automate**: Set up cron job for weekly updates

---

## Cost

**Gemini API** (Gemini 1.5 Flash):
- Per user: ~$0.0003 (less than a penny!)
- 1,000 users: ~$0.30/month

**Totally free alternative**: Skip Gemini, use ALS + TF-IDF only

---

## Full Documentation

📖 [Complete Setup Guide](AI_RECOMMENDATIONS_SETUP.md)
📊 [Implementation Summary](../IMPLEMENTATION_SUMMARY.md)

Happy watching! 🍿
