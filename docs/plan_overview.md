# Matrix Factorization Integration Plan

This document outlines the step-by-step plan for implementing an implicit-feedback matrix factorization recommendation system in the Next.js + Supabase + Drizzle-ORM project, based on the provided example in [`matrix-factor-ex.md`](matrix-factor-ex.md:1).

---

## Overview

Implement an implicit matrix factorization system using only the existing `watchlists` table. The solution leverages `libmf` for model training and prediction, integrates with Supabase for data access, and provides API and frontend components for recommendations.

---

## Implementation Steps

1. **Install Required Packages**
   - `libmf`, `@supabase/supabase-js`, `drizzle-orm`, `node-fetch`, `ts-node`
   - Add `"train:implicit"` script to `package.json`.

2. **Create Data Preparation Service**
   - File: [`services/ImplicitDataPrep.ts`](services/ImplicitDataPrep.ts:1)
   - Exports watchlist interactions for model training.

3. **Create Model Training Script**
   - File: [`scripts/trainImplicitModel.ts`](scripts/trainImplicitModel.ts:1)
   - Trains the matrix factorization model using exported data.

4. **Create Recommendation Service**
   - File: [`services/ImplicitRecService.ts`](services/ImplicitRecService.ts:1)
   - Loads trained model and generates recommendations.

5. **Create API Endpoint**
   - File: [`app/api/implicit-recs/[userId]/route.ts`](app/api/implicit-recs/[userId]/route.ts:1)
   - Serves recommendations for a given user.

6. **Create Frontend Component**
   - File: [`components/ImplicitRecommendations.tsx`](components/ImplicitRecommendations.tsx:1)
   - Renders recommended movies.

7. **Ensure Directories Exist**
   - Create `data/` and `models/` directories if missing.

---

## File Map

- `services/ImplicitDataPrep.ts`
- `scripts/trainImplicitModel.ts`
- `services/ImplicitRecService.ts`
- `app/api/implicit-recs/[userId]/route.ts`
- `components/ImplicitRecommendations.tsx`
- `package.json` (update scripts/dependencies)
- `data/` (for training data)
- `models/` (for trained model)

---

## Test Coverage Requirements

- **Unit Tests**
  - `ImplicitDataPrep`: Export logic, error handling
  - `ImplicitRecService`: Recommendation filtering, output
  - `trainImplicitModel`: Training flow, error handling (mocked)

- **API Tests**
  - `implicit-recs` endpoint: Valid/invalid userId, error responses, payload

- **Component Tests**
  - `ImplicitRecommendations.tsx`: Rendering, empty state, score formatting

- **Integration Test**
  - End-to-end: Train model, call API, render recommendations

---

## Queue Tasks for Handoff

```json
[
  {
    "mode": "beast-developer",
    "goal": "Create services/ImplicitDataPrep.ts for exporting watchlist interactions as described in matrix-factor-ex.md."
  },
  {
    "mode": "beast-developer",
    "goal": "Create scripts/trainImplicitModel.ts for training the implicit matrix factorization model."
  },
  {
    "mode": "beast-developer",
    "goal": "Create services/ImplicitRecService.ts for generating recommendations using the trained model."
  },
  {
    "mode": "beast-developer",
    "goal": "Create app/api/implicit-recs/[userId]/route.ts API endpoint for serving recommendations."
  },
  {
    "mode": "beast-developer",
    "goal": "Create components/ImplicitRecommendations.tsx for rendering recommended movies."
  },
  {
    "mode": "beast-developer",
    "goal": "Update package.json to add train:implicit script and ensure required dependencies are installed."
  },
  {
    "mode": "beast-developer",
    "goal": "Create data/ and models/ directories if missing."
  },
  {
    "mode": "beast-analyzer",
    "goal": "Write unit tests for ImplicitDataPrep, ImplicitRecService, and trainImplicitModel scripts."
  },
  {
    "mode": "beast-analyzer",
    "goal": "Write API tests for implicit-recs endpoint."
  },
  {
    "mode": "beast-analyzer",
    "goal": "Write component tests for ImplicitRecommendations.tsx."
  },
  {
    "mode": "beast-analyzer",
    "goal": "Write end-to-end integration test for training, API, and frontend flow."
  },
  {
    "mode": "beast-documenter",
    "goal": "Document matrix factorization integration and usage in README.md."
  }
]
```

---

## Notes

- All code should follow project conventions and be modular.
- Ensure all new code is covered by tests before completion.
- Refer to [`matrix-factor-ex.md`](matrix-factor-ex.md:1) for implementation details and code snippets.
