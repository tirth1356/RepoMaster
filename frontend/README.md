# GitHub Repository Evaluator

A comprehensive tool to evaluate and analyze GitHub repositories, providing actionable feedback to improve your projects.

## Features

- 🎯 **Comprehensive Analysis**: Evaluates documentation, structure, commits, testing, and more
- 📊 **Detailed Scoring**: Get scores across multiple dimensions
- 🗺️ **Improvement Roadmap**: Receive prioritized suggestions for enhancement
- ⚡ **Fast & Serverless**: Built with Next.js, deployable on Vercel
- 🔒 **Privacy First**: No login required, no data storage

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes (serverless functions)
- **APIs**: GitHub REST API
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub Personal Access Token

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd github-repo-evaluator/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your GitHub token:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

**Important**: Don't forget to add the `GITHUB_TOKEN` environment variable in Vercel!

## Project Structure

```
frontend/
├── pages/
│   ├── index.jsx          # Home page
│   ├── analyze.jsx        # Analysis page
│   ├── _app.jsx          # App wrapper
│   └── api/              # API routes (serverless functions)
│       ├── analyze.js    # Repository analysis endpoint
│       └── health.js     # Health check endpoint
├── components/
│   ├── ScoreDisplay.jsx
│   ├── SummaryDisplay.jsx
│   └── RoadmapDisplay.jsx
├── lib/
│   ├── api.js            # Frontend API client
│   ├── analyzer.js       # Repository analysis logic
│   └── githubService.js  # GitHub API integration
└── styles/
    └── globals.css       # Global styles + Tailwind
```

## How It Works

1. **Input**: User provides a GitHub repository URL
2. **Fetch**: API routes fetch repository data from GitHub API
3. **Analyze**: Scoring algorithms evaluate multiple aspects:
   - Documentation quality
   - Project structure
   - Commit history
   - Testing coverage
   - Community engagement
   - Versioning practices
4. **Results**: User receives:
   - Overall score and level (Beginner/Intermediate/Advanced)
   - Detailed scores by category
   - Summary of strengths and weaknesses
   - Prioritized improvement roadmap

## API Routes

### `POST /api/analyze`
Analyzes a GitHub repository.

**Request Body:**
```json
{
  "url": "https://github.com/owner/repo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 75,
    "level": "Intermediate",
    "scores": { ... },
    "summary": "...",
    "roadmap": [...],
    "metadata": { ... }
  }
}
```

### `GET /api/health`
Health check endpoint.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token for API requests |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

For deployment issues or questions, check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide.
