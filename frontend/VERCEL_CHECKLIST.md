# Vercel Deployment Checklist ✅

Follow these steps to deploy your app to Vercel:

## Pre-Deployment

- [x] Backend logic integrated into Next.js API routes (`pages/api/`)
- [x] All dependencies listed in `package.json`
- [x] `.gitignore` configured to exclude `.env.local`
- [x] Build successful locally (`npm run build`)
- [ ] GitHub token ready (get one from https://github.com/settings/tokens)

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. **Important**: Set Root Directory to `frontend`
6. Framework Preset: Next.js (should auto-detect)
7. Click "Environment Variables"
8. Add:
   - Name: `GITHUB_TOKEN`
   - Value: [paste your GitHub token]
9. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Add environment variable
vercel env add GITHUB_TOKEN

# Deploy to production
vercel --prod
```

### 3. Verify Deployment

- [ ] Visit your Vercel URL
- [ ] Check "Service Active" indicator is green
- [ ] Test analyzing a repository (e.g., https://github.com/vercel/next.js)
- [ ] Verify all pages load correctly
- [ ] Check console for any errors

## Post-Deployment

### Update Repository Settings
- [ ] Add deployment URL to repository description
- [ ] Update README with live demo link
- [ ] Consider adding a custom domain (optional)

### Monitor
- [ ] Check Vercel deployment logs if issues occur
- [ ] Monitor GitHub API rate limits
- [ ] Set up alerts for failed deployments (optional)

## Common Issues & Solutions

### ❌ "Service Offline" showing
**Solution**: Check that `GITHUB_TOKEN` is set in Vercel environment variables, then redeploy.

### ❌ GitHub API rate limit errors
**Solution**: Ensure your GitHub token is properly configured and has the right scopes.

### ❌ Build fails on Vercel
**Solution**: 
- Check build logs in Vercel dashboard
- Ensure `package.json` includes all dependencies
- Verify Node.js version compatibility

### ❌ 404 errors for API routes
**Solution**: Make sure root directory is set to `frontend` in Vercel project settings.

## Environment Variables Reference

| Variable | Where to Add | Required | Description |
|----------|--------------|----------|-------------|
| `GITHUB_TOKEN` | Vercel Dashboard | Yes | Your GitHub Personal Access Token |

## GitHub Token Permissions

When creating your token, ensure these permissions:
- ✅ `public_repo` - Access public repositories
- ✅ (Optional) `read:org` - If analyzing org repos

## Useful Commands

```bash
# Build locally
npm run build

# Start production server locally
npm run start

# Check for linting errors
npm run lint

# Deploy to preview (Vercel CLI)
vercel

# Deploy to production (Vercel CLI)
vercel --prod

# View logs (Vercel CLI)
vercel logs
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Token Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

**Ready to deploy?** Start with step 1! 🚀
