# Vercel Deployment Guide

## Current Status
Your project is already deployed on Vercel at: **https://smartmeter-coral.vercel.app/**

## Deployment Methods

### Option 1: Automatic Deployment via Git (Recommended)
If your Vercel project is connected to your Git repository, it will automatically deploy when you push changes:

1. **Push changes to your repository:**
   ```bash
   cd smartmeter
   git add -A
   git commit -m "Update dashboard and features"
   git push origin main
   ```

2. **Vercel will automatically:**
   - Detect the push
   - Build the project
   - Deploy to production

### Option 2: Manual Deployment via Vercel CLI

1. **Login to Vercel:**
   ```bash
   cd smartmeter
   vercel login
   ```
   This will open a browser window for authentication.

2. **Link to existing project (if needed):**
   ```bash
   vercel link
   ```
   Select your existing project: `smartmeter-coral`

3. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Option 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project: `smartmeter-coral`
3. Click "Redeploy" or trigger a new deployment

## Project Configuration

Your `vercel.json` configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Environment Variables

Make sure these are set in your Vercel project settings:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to `production` for production deployments

## Build Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Next Steps

Since your changes are already pushed to Git, Vercel should automatically deploy them if:
1. The project is connected to your Git repository
2. Auto-deploy is enabled for the branch (usually `main` or `master`)

To verify deployment status:
1. Check the Vercel dashboard
2. Look for recent deployments
3. Check build logs if deployment fails

## Troubleshooting

If automatic deployment doesn't work:
1. Check Vercel dashboard for build errors
2. Verify Git repository connection
3. Check environment variables are set correctly
4. Review build logs in Vercel dashboard
