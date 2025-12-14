# GitHub Repository Evaluation Platform

A modern, user-friendly web application that analyzes public GitHub repositories and provides comprehensive evaluations to help students and early-career developers understand how their projects appear to recruiters and mentors.

## 🎯 Purpose

This platform provides honest, actionable feedback on GitHub repositories by evaluating:
- **Documentation Quality** - README clarity and completeness
- **Code Structure** - Project organization and folder hierarchy
- **Commit History** - Consistency and meaningful messages
- **Testing** - Test coverage and quality assurance
- **Language & Tech Stack** - Appropriate technology choices
- **Community Engagement** - Stars, forks, and project impact
- **Versioning** - Release management and semantic versioning

## ✨ Features

### Landing Page
- Modern, minimal design with clear value proposition
- Three-step explanation of how the platform works
- Comprehensive feature overview
- Call-to-action buttons throughout

### Analysis Page
- Simple, intuitive URL input interface
- Real-time loading feedback with spinner
- Detailed error messages for common issues
- Support for public repositories only

### Results Dashboard
- **Score Display**: 0-100 numerical score with qualitative level (Beginner/Intermediate/Advanced)
- **Progress Visualization**: Color-coded progress bar showing performance level
- **Summary Section**: Personalized analysis explaining strengths and areas for improvement
- **Improvement Roadmap**: Prioritized, actionable steps for enhancement
- **Detailed Breakdown**: Individual scores for each evaluation category
- **Repository Metadata**: Stars, forks, language, and GitHub link

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Hooks** - State management and side effects

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **GitHub API** - Public repository data access
- **CORS** - Cross-origin resource sharing

## 📋 Requirements

### System Requirements
- Node.js 16.x or higher
- npm or yarn package manager
- Internet connection for GitHub API access

### GitHub API Access
- No authentication required for public repositories
- Optional GitHub token via `GITHUB_TOKEN` environment variable for higher rate limits
- Rate limit: 60 requests/hour (unauthenticated), 5000 requests/hour (authenticated)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd C:\Users\tirth\github-repo-evaluator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (optional):
```env
PORT=5000
GITHUB_TOKEN=your_github_token_here
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the frontend directory (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🏃 Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

Verify with:
```bash
curl http://localhost:5000/api/health
```

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

Open `http://localhost:3000` in your browser.

## 📊 How the Analysis Works

### 1. Data Collection
The backend fetches data from GitHub API:
- Repository metadata (stars, forks, watchers)
- Repository contents and structure
- Commit history (up to 100 commits)
- Programming languages
- README file
- Release history

### 2. Scoring Algorithm
Each aspect is scored independently (0-100):
- **Documentation** (20% weight): README size, content quality, license presence
- **Structure** (15% weight): Directory organization, presence of src/tests/docs
- **Commits** (15% weight): Count, message quality, recent activity
- **Languages** (10% weight): Tech stack diversity and suitability
- **Community** (15% weight): Engagement metrics and project description
- **Testing** (15% weight): Presence of test files and frameworks
- **Versioning** (10% weight): Releases and semantic versioning

Overall score is a weighted average of all categories.

### 3. Roadmap Generation
Based on identified weaknesses, the system generates:
- **High Priority**: Critical improvements (documentation, testing)
- **Medium Priority**: Important enhancements (commits, structure, versioning)
- **Low Priority**: Nice-to-have optimizations (community engagement)

Each roadmap item includes:
- Clear description of the improvement
- Practical implementation guidance
- Expected impact on the project

## 🔒 Privacy & Security

- **No Database**: All analysis is on-demand, nothing is stored
- **No Authentication**: No user accounts or login required
- **No Tracking**: No analytics or user data collection
- **Public Data Only**: Only analyzes publicly available repositories
- **CORS Enabled**: Frontend and backend can run on different origins

## 📖 API Endpoints

### Health Check
```
GET /api/health
```

### Analyze Repository (POST)
```
POST /api/analyze
Content-Type: application/json

{
  "url": "https://github.com/owner/repository"
}
```

### Analyze Repository (GET)
```
GET /api/analyze/:owner/:repo
```

**Response**:
```json
{
  "success": true,
  "data": {
    "score": 75,
    "level": "Advanced",
    "summary": "...",
    "roadmap": [...],
    "scores": {
      "documentation": 85,
      "structure": 70,
      ...
    },
    "metadata": {
      "name": "repository",
      "url": "...",
      "stars": 100,
      "forks": 50,
      "language": "JavaScript"
    }
  }
}
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm run lint
```

## 🚢 Production Build

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
npm start
```

## 📁 Project Structure

```
github-repo-evaluator/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── analyzer.js            # Repository analysis logic
│   ├── githubService.js       # GitHub API client
│   ├── package.json           # Dependencies
│   └── .env                   # Environment variables (optional)
├── frontend/
│   ├── pages/
│   │   ├── _app.jsx           # Next.js app wrapper
│   │   ├── index.jsx          # Landing page
│   │   └── analyze.jsx        # Analysis page
│   ├── components/
│   │   ├── ScoreDisplay.jsx   # Score visualization
│   │   ├── SummaryDisplay.jsx # Analysis summary
│   │   └── RoadmapDisplay.jsx # Improvement roadmap
│   ├── lib/
│   │   └── api.js             # API client
│   ├── styles/
│   │   └── globals.css        # Global styles
│   ├── package.json           # Dependencies
│   └── tailwind.config.js     # Tailwind configuration
├── docs/                      # Documentation
└── README.md                  # This file
```

## 🎓 For Recruiters & Mentors

This platform helps students demonstrate professional development practices:
- Well-documented projects show communication skills
- Consistent commits reflect discipline and planning
- Comprehensive tests indicate quality focus
- Clean structure demonstrates software engineering knowledge
- Proper versioning shows maturity and responsibility

## 🐛 Troubleshooting

### "Backend service is not available"
- Ensure backend is running: `npm run dev` in the backend directory
- Check that port 5000 is not in use
- Verify `NEXT_PUBLIC_API_URL` is correct in frontend

### "Repository not found"
- Ensure repository URL is public (not private)
- Check URL format: `https://github.com/owner/repo`
- Verify repository exists on GitHub

### "Rate limit exceeded"
- Add GitHub token to increase rate limit from 60 to 5000 requests/hour
- Create a token at: https://github.com/settings/tokens
- Set `GITHUB_TOKEN` environment variable in backend

### Slow analysis
- First-time analysis may take 10-30 seconds due to GitHub API calls
- Subsequent requests are faster as GitHub caches responses

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests
- Improve documentation

## 📧 Support

For issues or questions:
1. Check this README for troubleshooting
2. Verify your setup follows the installation instructions
3. Ensure backend and frontend are both running

## 🎉 Getting Started

1. Clone/setup the project
2. Start backend and frontend servers
3. Open `http://localhost:3000`
4. Enter a GitHub repository URL
5. Get instant feedback and actionable insights!

---

Built with ❤️ to help developers build better portfolios.
