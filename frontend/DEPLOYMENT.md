# Deploying to Vercel

This guide will help you deploy your GitHub Repository Evaluator to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. A GitHub Personal Access Token

## Step 1: Get Your GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "Repo Evaluator")
4. Select scope: `public_repo` (for accessing public repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the `frontend` directory as the root directory
4. Vercel will auto-detect Next.js
5. Add Environment Variable:
   - Key: `GITHUB_TOKEN`
   - Value: (paste your GitHub token)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts, then add the environment variable:
   ```bash
   vercel env add GITHUB_TOKEN
   ```
   Paste your GitHub token when prompted.

6. Redeploy with the new environment variable:
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

1. Visit your deployed URL (e.g., `https://your-app.vercel.app`)
2. Check that the "Service Active" indicator is green
3. Try analyzing a public repository (e.g., `https://github.com/vercel/next.js`)

## Important Notes

- **Never commit your `.env.local` file** - it contains your secret token
- The `GITHUB_TOKEN` environment variable must be set in Vercel's dashboard
- Without the token, GitHub API rate limits are very restrictive (60 requests/hour)
- With the token, you get 5,000 requests/hour

## Troubleshooting

### "Service Offline" error
- Make sure `GITHUB_TOKEN` is set in Vercel environment variables
- Redeploy after adding environment variables

### GitHub API rate limit exceeded
- Verify your token is correctly set
- Token must have `public_repo` scope

### Build fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (use Node 18+)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token for API requests |

## Support

For issues, check the Vercel deployment logs in your dashboard.
