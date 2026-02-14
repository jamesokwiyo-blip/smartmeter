# Vercel Update Instructions

## Step-by-Step Guide to Update Vercel Deployment

### Option 1: Update Existing Project (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your project: `smartmeter-gilt` (or check your deployments)
   - Live URL: https://smartmeter-gilt.vercel.app/

2. **Update Git Repository Connection**
   - Click on project → **Settings** → **Git**
   - If connected to old repo, click **Disconnect**
   - Click **Connect Git Repository**
   - Select: `YUMVUHORE/smartmeter`
   - Branch: `main`
   - Click **Save**

3. **Set Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add/Update:
     ```
     VITE_API_URL = https://smartmeter-jdw0.onrender.com/api
     NODE_ENV = production
     ```
   - Set for: **Production**, **Preview**, **Development**
   - Click **Save**

4. **Verify Build Settings**
   - Go to **Settings** → **General**
   - Verify:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

5. **Trigger New Deployment**
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Select **Redeploy**
   - Or: Push a new commit to trigger auto-deploy

### Option 2: Create New Project

1. **Create New Project**
   - Vercel Dashboard → **Add New Project**
   - Import: `YUMVUHORE/smartmeter`
   - Branch: `main`

2. **Configure Project**
   - Framework: **Vite** (auto-detected)
   - Root Directory: (leave empty)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   - Add: `VITE_API_URL = https://smartmeter-jdw0.onrender.com/api`
   - Add: `NODE_ENV = production`

4. **Deploy**
   - Click **Deploy**
   - Wait for build to complete

### Verification Steps

After deployment:

1. **Check Build Logs**
   - Go to **Deployments** → Latest deployment
   - Click to view build logs
   - Verify no errors

2. **Test the Site**
   - Visit: https://smartmeter-gilt.vercel.app/
   - Open browser console (F12)
   - Check for errors

3. **Test API Connection**
   - Try to login or register
   - Check Network tab for API calls
   - Verify responses are successful

4. **Verify Functionality**
   - Test login/registration
   - Test dashboard
   - Verify data loads correctly

### Troubleshooting

#### Build Fails
- Check build logs for specific error
- Verify Node.js version (18.x or 20.x)
- Check all dependencies are in package.json

#### API Calls Fail
- Verify `VITE_API_URL` is set correctly
- Check backend is running
- Verify CORS allows Vercel domain

#### Site Shows Blank Page
- Check browser console for errors
- Verify build completed successfully
- Check if routes are configured correctly

### Quick Commands (Via Vercel CLI)

If you have Vercel CLI installed:

```bash
cd smartmeter
vercel login
vercel link  # Link to existing project
vercel env add VITE_API_URL production
# Enter: https://smartmeter-jdw0.onrender.com/api
vercel --prod
```

### Important Notes

- **Environment Variables**: Must be set in Vercel dashboard, not in code
- **CORS**: Backend must allow `https://smartmeter-gilt.vercel.app`
- **Auto-deploy**: Enabled by default when connected to Git
- **Build Time**: Usually 2-5 minutes

### Support

If issues persist:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify backend is accessible
4. Review environment variables
5. Check CORS configuration
