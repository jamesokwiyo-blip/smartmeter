# Deployment Instructions

## Quick Deploy to Vercel

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import: `https://github.com/YUMVUHORE/smartmeter.git`
4. Select branch: `main`

### 2. Configure Project
- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: (leave empty)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### 3. Set Environment Variables
Go to **Settings → Environment Variables** and add:

```
VITE_API_URL=https://smartmeter-jdw0.onrender.com/api
NODE_ENV=production
```

### 4. Deploy
- Click "Deploy"
- Wait for build to complete
- Visit your deployment URL

### 5. Update Existing Project
If project already exists:
1. **Settings → Git** → Update repository to new URL
2. **Settings → Environment Variables** → Add/update variables
3. **Deployments** → Click "Redeploy"

## Environment Variables Reference

| Variable | Value | Required | Description |
|----------|-------|----------|-------------|
| `VITE_API_URL` | `https://smartmeter-jdw0.onrender.com/api` | Yes | Backend API URL |
| `NODE_ENV` | `production` | Yes | Node environment |

## Backend Requirements

Ensure your backend (Render) has:
- CORS configured to allow `https://smartmeter-coral.vercel.app`
- MongoDB connection configured
- JWT secret set
- All API routes working

## Post-Deployment

1. Test the site: https://smartmeter-coral.vercel.app/
2. Check browser console for errors
3. Test login/registration
4. Verify API connections
5. Test dashboard functionality
