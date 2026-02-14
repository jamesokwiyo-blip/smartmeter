# Vercel Deployment Setup Checklist

## Pre-Deployment Checklist

### 1. **Git Repository**
- [x] Repository changed to: `https://github.com/YUMVUHORE/smartmeter.git`
- [x] All changes pushed to `main` branch
- [ ] Vercel connected to new repository

### 2. **Vercel Project Settings**

#### Git Connection
- [ ] Go to Vercel Dashboard → Project Settings → Git
- [ ] Disconnect old repository (if connected)
- [ ] Connect to: `https://github.com/YUMVUHORE/smartmeter.git`
- [ ] Select branch: `main`
- [ ] Enable "Auto-deploy" for main branch

#### Build Settings
- [ ] Framework Preset: **Vite**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Root Directory: `smartmeter` (if project is in subdirectory)

### 3. **Environment Variables**

Set these in Vercel Dashboard → Settings → Environment Variables:

#### Required for Frontend:
- [ ] `VITE_API_URL` = `https://smartmeter-jdw0.onrender.com/api` (or your backend URL)
- [ ] `NODE_ENV` = `production`

#### If Deploying Backend on Vercel:
- [ ] `MONGODB_URI` = Your MongoDB connection string
- [ ] `JWT_SECRET` = Your JWT secret key
- [ ] `PORT` = `5000` (or your port)

**Important**: 
- Set environment for: **Production** (and Preview if needed)
- After adding variables, **redeploy** the project

### 4. **Backend Configuration**

#### CORS Settings
Ensure your backend allows the Vercel domain:
```javascript
// In backend CORS configuration
const allowedOrigins = [
  'http://localhost:8082',
  'http://localhost:8080',
  'https://smartmeter-coral.vercel.app',  // Add this
  // ... other origins
];
```

### 5. **Verify Deployment**

#### Check Build Logs
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check "Build Logs" tab
4. Look for errors or warnings

#### Test the Deployment
1. Visit: https://smartmeter-coral.vercel.app/
2. Open browser console (F12)
3. Check for errors:
   - Network errors
   - JavaScript errors
   - API connection failures

#### Test API Connection
1. Try to login or register
2. Check Network tab in browser console
3. Verify API calls are going to correct backend URL
4. Check response status codes

### 6. **Common Issues**

#### Issue: "Failed to fetch" or Network Error
- **Check**: Backend URL is correct
- **Check**: Backend server is running
- **Check**: CORS is configured correctly
- **Fix**: Update `VITE_API_URL` in Vercel environment variables

#### Issue: Build Fails
- **Check**: Build logs for specific error
- **Check**: All dependencies in `package.json`
- **Fix**: May need to update build command or Node version

#### Issue: 404 on Routes
- **Check**: `vercel.json` has correct rewrites
- **Check**: Output directory is `dist`
- **Fix**: Verify SPA routing configuration

#### Issue: API Calls Fail
- **Check**: `VITE_API_URL` environment variable is set
- **Check**: Backend is accessible from internet
- **Check**: CORS allows Vercel domain
- **Fix**: Update backend CORS and verify API URL

## Quick Fix Commands

### Update Environment Variable
```bash
# Via Vercel CLI (after login)
vercel env add VITE_API_URL production
# Enter: https://smartmeter-jdw0.onrender.com/api
```

### Force Redeploy
```bash
# Via Vercel CLI
vercel --prod --force
```

### Check Deployment Status
```bash
vercel ls
```

## Next Steps After Setup

1. ✅ Verify Git repository is connected
2. ✅ Set all environment variables
3. ✅ Trigger new deployment
4. ✅ Check build logs for errors
5. ✅ Test the live site
6. ✅ Verify API connections work
7. ✅ Test login/registration
8. ✅ Test dashboard functionality

## Support

If issues persist:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify backend is running and accessible
4. Test API endpoints directly
5. Review CORS configuration
