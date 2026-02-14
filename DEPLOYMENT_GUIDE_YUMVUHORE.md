# 🚀 Complete Deployment Guide - Render.com & Vercel
## Using Your GitHub Repository: `YUMVUHORE/smartmeter`

**Verified:** This guide has been checked against the project. The following are in place:
- `smartmeter/server/package.json` exists (for Render root directory `smartmeter/server`)
- `smartmeter/vercel.json` exists (for Vercel SPA rewrites when root is `smartmeter`)
- `.github/workflows/keepalive.yml` pings Render; update the URL in the workflow if your service name differs
- Backend CORS in `smartmeter/server/index.js` allows `*.vercel.app`; add your exact Vercel URL to `allowedOrigins` if needed
- Frontend `smartmeter/src/lib/api.ts` uses `VITE_API_URL`; set it in Vercel to your Render API URL

This guide will help you deploy your Smart Energy Meter project to:
- **Render.com** - Backend API server
- **Vercel** - Frontend web application

---

## 📋 Prerequisites

1. ✅ GitHub account with repository: `YUMVUHORE/smartmeter`
2. ✅ Render.com account (free tier available)
3. ✅ Vercel account (free tier available)
4. ✅ MongoDB Atlas account (free tier available)
5. ✅ All code pushed to GitHub

---

## Part 1: Deploy Backend to Render.com

### Step 1: Create Render.com Account
1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account (recommended)
4. Authorize Render to access your GitHub repositories

### Step 2: Create New Web Service
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Select repository: **`YUMVUHORE/smartmeter`**

### Step 3: Configure Backend Service

**Basic Settings:**
- **Name**: `smartmeter-api` (or any name you prefer)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `smartmeter/server` ⚠️ **IMPORTANT**
  - This tells Render where your server code is located
  - If this doesn't work, try just `server` (but `smartmeter/server` is most likely)
- **Runtime**: `Node`
- **Build Command**: `npm install`
  - ⚠️ **Since Root Directory is `smartmeter/server`, the build runs there automatically**
  - No need for `cd server` in the build command
- **Start Command**: `npm start` or `node index.js`
  - Check `smartmeter/server/package.json` to see which script is defined

**⚠️ IMPORTANT - Root Directory:**
- If your GitHub repo `YUMVUHORE/smartmeter` contains the full project with `smartmeter/` folder → Use: `smartmeter/server`
- If your GitHub repo `YUMVUHORE/smartmeter` IS the smartmeter folder (server at root) → Use: `server`
- See `RENDER_ROOT_DIRECTORY_FIX.md` for troubleshooting

**Environment Variables:**
Click **"Add Environment Variable"** and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartmeter?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
NODE_ENV=production
PORT=10000
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Replace `JWT_SECRET` with a long random string (e.g., use `openssl rand -hex 32`)
- Render.com uses port from `PORT` environment variable or default port
- Root Directory must be `smartmeter/server` (where your `index.js` is located)

### Step 4: Create package.json for Server (if missing)

If `smartmeter/server/package.json` doesn't exist, create it:

```json
{
  "name": "smartmeter-server",
  "version": "1.0.0",
  "type": "module",
  "description": "Smart Energy Meter Backend API",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongoose": "^9.1.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

Save this as: `smartmeter/server/package.json`

### Step 5: Update CORS in server/index.js

Make sure your `smartmeter/server/index.js` (or `smartmeter/server/index.js`) has CORS configured to allow your Vercel domain:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:3000',
  'https://your-app-name.vercel.app',  // Add your Vercel URL here
  'https://*.vercel.app',  // Allow all Vercel subdomains
];
```

### Step 6: Deploy
1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Start your server
3. Wait 2-3 minutes for deployment
4. Your backend URL will be: `https://your-service-name.onrender.com`

**Note the URL** - you'll need it for Vercel configuration!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to: **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with your GitHub account (recommended)
4. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project
1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Select repository: **`YUMVUHORE/smartmeter`**
3. Click **"Import"**

### Step 3: Configure Frontend Project

**Project Settings:**
- **Framework Preset**: `Vite` (or `Other` if Vite not detected)
- **Root Directory**: `smartmeter` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build` (or check your package.json)
- **Output Directory**: `dist` (default for Vite)
- **Install Command**: `npm install`

**Environment Variables:**
Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-service-name.onrender.com/api
NODE_ENV=production
```

**Important:**
- Replace `your-service-name.onrender.com` with your actual Render.com backend URL
- The `VITE_` prefix is required for Vite to expose the variable to the frontend

### Step 4: Update vercel.json (if needed)

Make sure `smartmeter/vercel.json` exists:

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

### Step 5: Update Frontend API Configuration

Check `smartmeter/src/lib/api.ts` (or wherever your API base URL is configured):

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-service-name.onrender.com/api';
```

### Step 6: Deploy
1. Click **"Deploy"**
2. Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your frontend
   - Deploy to CDN
3. Wait 1-2 minutes
4. Your frontend URL will be: `https://your-project-name.vercel.app`

---

## Part 3: Update Backend CORS for Vercel

After Vercel deployment, update your Render.com backend CORS:

1. Go to Render.com dashboard
2. Find your backend service
3. Go to **"Environment"** tab
4. Add new environment variable (or update code):

In `smartmeter/server/index.js`, update `allowedOrigins`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:3000',
  'https://your-project-name.vercel.app',  // Your Vercel URL
  'https://*.vercel.app',  // Allow all Vercel subdomains
];
```

5. **Redeploy** the backend service (Render will auto-redeploy on git push, or click "Manual Deploy")

---

## Part 4: Update ESP32 Code

Update your ESP32 `src/main.cpp` to use the new Render.com backend URL:

```cpp
const char* apiBaseUrl = "https://your-service-name.onrender.com/api";
```

Replace `your-service-name` with your actual Render.com service name.

---

## Part 5: Prevent Render.com Auto-Suspension

### Option 1: GitHub Actions Keep-Alive (Recommended)

I've already created `.github/workflows/keepalive.yml` - just commit and push it:

```powershell
git add .github/workflows/keepalive.yml
git commit -m "Add keep-alive workflow"
git push
```

This will ping your API every 5 minutes to keep it awake.

### Option 2: UptimeRobot (Free)

1. Go to: **https://uptimerobot.com**
2. Create free account
3. Add monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-service-name.onrender.com/api/health`
   - **Interval**: 5 minutes
4. Save

---

## Part 6: Verify Deployment

### Test Backend:
```
https://your-service-name.onrender.com/api/health
```

Expected: `{"status":"Server is running"}`

### Test Frontend:
```
https://your-project-name.vercel.app
```

Should load your dashboard.

### Test Full Flow:
1. Open frontend: `https://your-project-name.vercel.app`
2. Register/Login
3. Make a purchase
4. Check ESP32 receives token automatically

---

## 📝 Checklist

### Backend (Render.com):
- [ ] Render.com account created
- [ ] Web service created
- [ ] Root directory set to `smartmeter/server`
- [ ] Environment variables configured (MONGODB_URI, JWT_SECRET, NODE_ENV, PORT)
- [ ] `package.json` exists in `smartmeter/server/`
- [ ] Service deployed and running
- [ ] Health endpoint working: `/api/health`
- [ ] CORS updated with Vercel URL

### Frontend (Vercel):
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `smartmeter`
- [ ] Environment variable `VITE_API_URL` set to Render.com backend URL
- [ ] `vercel.json` configured
- [ ] Frontend deployed and accessible
- [ ] Can login/register
- [ ] Can make purchases

### ESP32:
- [ ] `apiBaseUrl` updated to Render.com backend URL
- [ ] Code uploaded to ESP32
- [ ] ESP32 can connect to backend
- [ ] Tokens are received automatically

### Keep-Alive:
- [ ] GitHub Actions workflow enabled (or UptimeRobot configured)
- [ ] Service stays awake (no auto-suspension)

---

## 🔧 Troubleshooting

### Backend Issues:

**Service won't start:**
- Check Root Directory is `smartmeter/server`
- Verify `package.json` exists in `smartmeter/server/`
- Check build logs in Render dashboard
- Verify environment variables are set

**503 Errors:**
- Service might be suspended (free tier)
- Check Render dashboard for service status
- Set up keep-alive to prevent suspension

**CORS Errors:**
- Update `allowedOrigins` in `server/index.js`
- Add your Vercel URL to the list
- Redeploy backend

### Frontend Issues:

**Build Fails:**
- Check Root Directory is `smartmeter`
- Verify `package.json` exists
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

**API Connection Errors:**
- Verify `VITE_API_URL` environment variable is set
- Check backend URL is correct
- Verify backend CORS allows Vercel domain
- Check browser console for errors

**404 on Routes:**
- Verify `vercel.json` has rewrites configured
- Check SPA routing is enabled

---

## 📚 Additional Resources

- **Render.com Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **GitHub Actions**: https://docs.github.com/en/actions

---

## 🎉 Success!

Once everything is deployed:
- ✅ Backend: `https://your-service-name.onrender.com/api`
- ✅ Frontend: `https://your-project-name.vercel.app`
- ✅ ESP32: Connected to backend
- ✅ Keep-alive: Preventing suspension

Your Smart Energy Meter system is now live! 🚀
