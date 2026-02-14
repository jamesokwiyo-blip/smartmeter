# Vercel Configuration - Aligned with Working Repository

## Configuration Comparison

I've compared your current repository with the working repository at [https://github.com/jamesokwiyo-blip/smartmeter.git](https://github.com/jamesokwiyo-blip/smartmeter.git) and aligned the configuration.

## Changes Made

### 1. **vercel.json** - Simplified to Match Working Version
**Previous (working):**
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

**Updated:** Now matches the working configuration exactly.

### 2. **API Configuration** - Aligned
- Same API base URL logic
- Same fallback to Render backend
- Same environment variable handling

### 3. **CORS Configuration** - Enhanced
- Kept all working origins
- Added `https://smartmeter-gilt.vercel.app` (your new deployment)
- Maintains backward compatibility with `smartmeter-coral.vercel.app`

## Vercel Deployment Settings

Based on the working repository, your Vercel project should have:

### Build Settings
- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` (default)

### Environment Variables (Required)
Set these in **Vercel Dashboard → Settings → Environment Variables**:

```
VITE_API_URL=https://smartmeter-jdw0.onrender.com/api
NODE_ENV=production
```

**Important**: 
- Set for: **Production**, **Preview**, **Development**
- After adding, **redeploy** the project

### Git Repository
- **Repository**: `https://github.com/YUMVUHORE/smartmeter.git`
- **Branch**: `main`
- **Auto-deploy**: Enabled

## Key Differences from Working Repo

### What's the Same ✅
- `vercel.json` configuration
- API URL configuration
- Build commands
- Project structure

### What's Enhanced ✅
- CORS includes `smartmeter-gilt.vercel.app`
- Additional documentation
- Production deployment guides

## Deployment Steps

1. **Verify Git Connection**
   - Vercel Dashboard → Settings → Git
   - Should be: `YUMVUHORE/smartmeter`
   - Branch: `main`

2. **Set Environment Variables**
   - Settings → Environment Variables
   - Add: `VITE_API_URL = https://smartmeter-jdw0.onrender.com/api`
   - Add: `NODE_ENV = production`
   - Set for all environments

3. **Redeploy**
   - Deployments → Latest deployment → Redeploy
   - Or wait for auto-deploy from Git push

4. **Test**
   - Visit: https://smartmeter-gilt.vercel.app/
   - Check browser console for errors
   - Test login/registration

## Verification

The configuration now matches the working repository structure:
- ✅ `vercel.json` - Simplified and aligned
- ✅ `src/lib/api.ts` - Same API configuration
- ✅ `server/index.js` - CORS updated with new domain
- ✅ Build settings - Same as working repo

## Next Steps

1. **Set Environment Variables in Vercel**
   - This is critical for the app to work
   - Without `VITE_API_URL`, it will use the fallback Render URL

2. **Redeploy**
   - Trigger a new deployment after setting env vars

3. **Test**
   - Verify the site works at https://smartmeter-gilt.vercel.app/
   - Check API connections
   - Test all functionality

## Troubleshooting

If the site still doesn't work after alignment:

1. **Check Environment Variables**
   - Must be set in Vercel dashboard
   - Not in code files

2. **Check Build Logs**
   - Vercel Dashboard → Deployments → Build Logs
   - Look for errors

3. **Check Browser Console**
   - F12 → Console tab
   - Look for API errors or CORS issues

4. **Verify Backend**
   - Test: https://smartmeter-jdw0.onrender.com/api/health
   - Should return: `{"status": "Server is running"}`
