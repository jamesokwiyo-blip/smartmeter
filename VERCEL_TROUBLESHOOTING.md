# Vercel Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. **Check Build Logs**
Go to Vercel Dashboard → Your Project → Deployments → Click on latest deployment → View Build Logs

Common build errors:
- Missing dependencies
- TypeScript errors
- Environment variables not set
- Build command failing

### 2. **Environment Variables**
Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

**Required Variables:**
- `VITE_API_URL` - Your backend API URL (e.g., `https://smartmeter-jdw0.onrender.com/api` or your backend URL)
- `NODE_ENV` - Set to `production`

**Backend Variables (if deploying backend on Vercel):**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (usually 5000)

### 3. **API URL Configuration**
The frontend is currently configured to use:
- **Development**: `http://localhost:5000/api`
- **Production**: `https://smartmeter-jdw0.onrender.com/api`

**To change the production API URL:**
1. Set `VITE_API_URL` environment variable in Vercel
2. Or update `smartmeter/src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 
     (import.meta.env.DEV 
       ? 'http://localhost:5000/api'
       : 'https://your-backend-url.com/api');  // Update this
   ```

### 4. **CORS Issues**
If you see CORS errors in browser console:
- Check backend CORS configuration
- Ensure Vercel domain is in allowed origins
- Backend should allow: `https://smartmeter-coral.vercel.app`

### 5. **Build Configuration**
Verify `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 6. **Git Repository Connection**
Since we changed the repository:
1. Go to Vercel Dashboard → Project Settings → Git
2. Disconnect old repository
3. Connect to: `https://github.com/YUMVUHORE/smartmeter.git`
4. Select branch: `main`
5. Redeploy

### 7. **Check Runtime Errors**
Open browser console (F12) and check for:
- Network errors (404, 500, CORS)
- JavaScript errors
- API connection failures

## Quick Fixes

### Fix 1: Update API URL
```bash
# In Vercel Dashboard, add environment variable:
VITE_API_URL=https://your-backend-url.com/api
```

### Fix 2: Reconnect Git Repository
1. Vercel Dashboard → Settings → Git
2. Disconnect current repository
3. Connect: `https://github.com/YUMVUHORE/smartmeter.git`
4. Branch: `main`
5. Redeploy

### Fix 3: Force Redeploy
1. Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Select "Redeploy"

### Fix 4: Check Backend Status
Verify your backend is running:
- Render: Check if service is running
- Check backend logs for errors
- Test API endpoint: `https://your-backend-url.com/api/health`

## Debugging Steps

1. **Check Vercel Build Logs**
   - Look for build errors
   - Check if dependencies installed correctly
   - Verify build completed successfully

2. **Check Browser Console**
   - Open https://smartmeter-coral.vercel.app/
   - Press F12 → Console tab
   - Look for errors

3. **Check Network Tab**
   - F12 → Network tab
   - See if API calls are failing
   - Check response status codes

4. **Verify Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Ensure all required variables are set
   - Make sure they're set for "Production" environment

5. **Test API Endpoint**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

## Common Error Messages

### "Failed to fetch"
- **Cause**: Backend not accessible or CORS issue
- **Fix**: Check backend URL and CORS configuration

### "404 Not Found"
- **Cause**: API endpoint doesn't exist
- **Fix**: Verify API routes in backend

### "Network Error"
- **Cause**: Backend server down or wrong URL
- **Fix**: Check backend status and URL

### Build Fails
- **Cause**: Missing dependencies or TypeScript errors
- **Fix**: Check build logs, run `npm install` locally

## Next Steps

1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test backend API is accessible
4. Check browser console for errors
5. Update API URL if needed
