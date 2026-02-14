# Production Deployment Guide

## Vercel Deployment Configuration

### Required Environment Variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

#### Frontend Variables (Required)
```
VITE_API_URL=https://smartmeter-jdw0.onrender.com/api
NODE_ENV=production
```

#### Backend Variables (If deploying backend on Vercel)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: (leave empty if project is at root)

### Git Repository

- **Repository**: `https://github.com/YUMVUHORE/smartmeter.git`
- **Branch**: `main`
- **Auto-deploy**: Enabled

### CORS Configuration

The backend is already configured to allow:
- `https://smartmeter-gilt.vercel.app` (Production)
- `https://smartmeter-coral.vercel.app` (Previous)
- All `*.vercel.app` domains
- All `*.netlify.app` domains

### Deployment Steps

1. **Connect Git Repository**
   - Vercel Dashboard → Settings → Git
   - Connect: `https://github.com/YUMVUHORE/smartmeter.git`
   - Branch: `main`

2. **Set Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Add all required variables (see above)
   - Set for: Production, Preview, Development

3. **Deploy**
   - Vercel will auto-deploy on push to `main`
   - Or manually trigger: Deployments → Redeploy

4. **Verify**
   - Check build logs for errors
   - Test the live site
   - Check browser console for errors

### Troubleshooting

#### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Check Node.js version (should be 18.x or 20.x)

#### API Connection Fails
- Verify `VITE_API_URL` is set correctly
- Check backend is running and accessible
- Verify CORS allows Vercel domain

#### 404 on Routes
- Verify `vercel.json` has correct rewrites
- Check output directory is `dist`
- Ensure SPA routing is configured

### Production Checklist

- [ ] Git repository connected
- [ ] Environment variables set
- [ ] Build settings configured
- [ ] CORS allows Vercel domain
- [ ] Backend is accessible
- [ ] Build completes successfully
- [ ] Site loads without errors
- [ ] API calls work correctly
- [ ] Login/Registration works
- [ ] Dashboard displays correctly
