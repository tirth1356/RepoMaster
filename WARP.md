# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

GitHub Repository Evaluator is a full-stack web application that analyzes public GitHub repositories and provides comprehensive evaluations. It helps students and developers understand how their projects appear to recruiters and mentors by scoring them across seven categories: documentation, code structure, commit history, testing, language/tech stack, community engagement, and versioning.

## Architecture

### Backend (Node.js/Express)
- **server.js**: Express entry point with two analysis endpoints:
  - `POST /api/analyze` - accepts GitHub URL in request body
  - `GET /api/analyze/:owner/:repo` - accepts owner and repo as URL parameters
  - Both endpoints return a unified response with scores, summary, and improvement roadmap

- **analyzer.js**: Core evaluation logic that:
  - Fetches repository data from GitHub API via githubService
  - Calculates 7 independent scores (0-100) using domain-specific logic
  - Computes weighted overall score (documentation 20%, structure/commits/testing/community each 15%, languages/versioning 10%)
  - Generates a written summary and actionable roadmap based on weaknesses

- **githubService.js**: GitHub API client wrapper using axios that handles:
  - Repository metadata, contents, commit history, languages, README, and releases
  - Supports optional GITHUB_TOKEN for higher rate limits (5000 vs 60 requests/hour)
  - Returns null gracefully for optional endpoints (README, releases)

### Frontend (Next.js 14/React)
- **pages/_app.jsx**: Global app wrapper with Tailwind CSS imports
- **pages/index.jsx**: Landing page with hero section, feature overview, and value proposition
- **pages/analyze.jsx**: Analysis interface with URL input, loading state, and results display
  - Renders ScoreDisplay, SummaryDisplay, and RoadmapDisplay components conditionally
  - Handles form submission, error messaging, and result scrolling
  
- **components/**: Reusable UI components
  - **ScoreDisplay.jsx**: Shows 0-100 score with color-coded progress bar and skill level badge
  - **SummaryDisplay.jsx**: Displays analysis summary and repository metadata
  - **RoadmapDisplay.jsx**: Renders prioritized improvement suggestions

- **lib/api.js**: Axios client for backend communication with timeout and error handling

## Key Development Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server with nodemon (watches for file changes)
npm start            # Start production server
npm test             # Run Jest tests
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start Next.js dev server on port 3000
npm run build        # Build for production
npm start            # Start production build
npm run lint         # Run ESLint
```

### Running the Full Stack
```bash
# Terminal 1
cd backend && npm run dev      # Backend runs on http://localhost:5000

# Terminal 2
cd frontend && npm run dev     # Frontend runs on http://localhost:3000
```

Verify health check:
```bash
curl http://localhost:5000/api/health
```

## Environment Configuration

### Backend (.env)
```env
PORT=5000
GITHUB_TOKEN=your_github_token_here  # Optional: increases rate limit
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend URL
```

## Scoring Algorithm Details

Each score (0-100) uses specialized heuristics:

- **Documentation**: README size (500+ chars ideal), setup/usage/license keywords, license file presence (max 100)
- **Structure**: Base 50, +10 for src dir, +10 for tests dir, +5 for docs, +5 for .gitignore, +10 for package.json/setup.py/go.mod (max 100)
- **Commits**: Count-based (50+ commits = 20pts), message quality ratio (>10 chars, not WIP/temp), recent activity in last 3 months (+20pts) (max 100)
- **Languages**: Language diversity bonus (+30 for 2+ languages, +20 for 3+), presence of Python/JS/TS/Java/Go/Rust/C++ (+40) (max 100)
- **Community**: Star count tiers, fork count, watcher count, issue count, description quality (max 100)
- **Testing**: Base 30, +70 if test/spec/coverage/jest/mocha/pytest/unittest/gotest indicators found (max 100)
- **Versioning**: Base 30, +40 for 5+ releases or +30 for 2-4 or +20 for 1, +10 for semantic versioning (max 100)

Overall score = weighted sum of above (see analyzer.js line 60-68)

## Data Flow

1. User enters GitHub URL in frontend
2. Frontend calls `POST /api/analyze` with URL
3. Backend parses owner/repo and calls `analyzeRepository(owner, repo)`
4. `analyzer.js` triggers 6 parallel GitHub API calls via `Promise.all()`
5. Scoring functions process raw data and generate evaluation
6. Backend returns unified response with score, level, scores object, summary, roadmap, and metadata
7. Frontend displays results with ScoreDisplay, SummaryDisplay, and RoadmapDisplay components

## Common Development Tasks

### Adding a New Scoring Category
1. Add calculation function to analyzer.js (e.g., `calculateNewScore()`)
2. Call it in `calculateScores()` and add to scores object
3. Adjust weights in weighted average calculation (line 60-68)
4. Add roadmap logic in `generateRoadmap()` if applicable
5. Update frontend display in analyze.jsx if needed

### Modifying GitHub Data Fetched
1. Add new GitHub API call in githubService.js
2. Export the function
3. Call it in analyzer.js via Promise.all() 
4. Use data in appropriate scoring function

### Adding Frontend Component
1. Create .jsx file in components/
2. Import and use in pages/analyze.jsx or index.jsx
3. Use Tailwind classes for styling (see tailwind.config.js for custom colors)

### Testing API Manually
```bash
# POST endpoint
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/torvalds/linux"}'

# GET endpoint
curl http://localhost:5000/api/analyze/torvalds/linux
```

## Performance Considerations

- First-time analysis takes 10-30s due to GitHub API latency (6 parallel requests)
- GitHub API is cached, so subsequent requests for same repo are faster
- Backend timeout set to 30s in api.js
- No database: all analysis is computed on-demand, nothing persisted

## Important Files

- **backend/analyzer.js**: Contains all scoring logic - modify here for evaluation changes
- **backend/githubService.js**: GitHub API integration - modify for additional data
- **frontend/pages/analyze.jsx**: Main user interface logic
- **frontend/lib/api.js**: API communication layer
- **README.md**: User-facing documentation with setup instructions
