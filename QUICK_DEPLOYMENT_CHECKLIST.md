# ⚡ Quick Deployment Checklist

## 🎯 Goal
Deploy Smart Energy Meter to Render.com (backend) and Vercel (frontend) using `YUMVUHORE/smartmeter` GitHub repository.

---

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to GitHub: `YUMVUHORE/smartmeter`
- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string ready
- [ ] JWT secret key generated (use: `openssl rand -hex 32` or any random string)

---

## 🟦 Part 1: Render.com Backend (5 minutes)

### Step 1: Create Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize Render access

### Step 2: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select repo: `YUMVUHORE/smartmeter`
- [ ] **Name**: `smartmeter-api`
- [ ] **Root Directory**: `smartmeter/server` ⚠️ CRITICAL
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`

### Step 3: Environment Variables
Add these in Render dashboard:
- [ ] `MONGODB_URI` = your MongoDB connection string
- [ ] `JWT_SECRET` = random secret string
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000` (or leave empty for Render default)

### Step 4: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 2-3 minutes
- [ ] **Note your URL**: `https://smartmeter-api.onrender.com` (or similar)
- [ ] Test: `https://your-url.onrender.com/api/health`

---

## 🟩 Part 2: Vercel Frontend (5 minutes)

### Step 1: Create Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Authorize Vercel access

### Step 2: Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select repo: `YUMVUHORE/smartmeter`
- [ ] **Root Directory**: `smartmeter` ⚠️ CRITICAL
- [ ] **Framework Preset**: `Vite`
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`

### Step 3: Environment Variables
Add in Vercel dashboard:
- [ ] `VITE_API_URL` = `https://your-render-url.onrender.com/api`
  - Replace `your-render-url` with your actual Render.com URL from Part 1

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait 1-2 minutes
- [ ] **Note your URL**: `https://smartmeter-xxx.vercel.app`
- [ ] Test: Open URL in browser

---

## 🔄 Part 3: Update Backend CORS (2 minutes)

### Update CORS in Render.com
1. Go to Render.com dashboard
2. Find your backend service
3. Go to "Environment" tab
4. Or update code: `smartmeter/server/index.js`

Add your Vercel URL to `allowedOrigins`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-vercel-url.vercel.app',  // Add this
  'https://*.vercel.app',  // Allow all Vercel subdomains
];
```

- [ ] Updated CORS with Vercel URL
- [ ] Redeployed backend (or push to GitHub for auto-deploy)

---

## 🔌 Part 4: Update ESP32 (1 minute)

Update `src/main.cpp`:
```cpp
const char* apiBaseUrl = "https://your-render-url.onrender.com/api";
```

- [ ] Updated ESP32 code
- [ ] Uploaded to ESP32

---

## 🛡️ Part 5: Prevent Suspension (2 minutes)

### Option 1: GitHub Actions (Recommended)
- [ ] File exists: `.github/workflows/keepalive.yml`
- [ ] Committed and pushed to GitHub
- [ ] GitHub Actions enabled (automatic)

### Option 2: UptimeRobot
- [ ] Go to https://uptimerobot.com
- [ ] Create account
- [ ] Add monitor: `https://your-render-url.onrender.com/api/health`
- [ ] Interval: 5 minutes

---

## ✅ Final Verification

### Backend
- [ ] Health check: `https://your-render-url.onrender.com/api/health`
- [ ] Response: `{"status":"Server is running"}`

### Frontend
- [ ] Opens in browser
- [ ] Can register/login
- [ ] Can make purchases
- [ ] Dashboard shows data

### ESP32
- [ ] Connects to backend
- [ ] Receives tokens automatically
- [ ] Sends energy data

---

## 📝 Important URLs to Save

After deployment, save these:

- **Backend URL**: `https://____________________.onrender.com`
- **Frontend URL**: `https://____________________.vercel.app`
- **MongoDB URI**: `mongodb+srv://...`
- **JWT Secret**: `____________________`

---

## 🆘 Quick Troubleshooting

**Backend won't start:**
- Check Root Directory is `smartmeter/server`
- Verify `package.json` exists in `smartmeter/server/`
- Check environment variables are set

**Frontend build fails:**
- Check Root Directory is `smartmeter`
- Verify `package.json` exists
- Check `VITE_API_URL` is set

**CORS errors:**
- Update `allowedOrigins` in `server/index.js`
- Add Vercel URL
- Redeploy backend

**503 errors:**
- Service suspended (free tier)
- Set up keep-alive
- Or upgrade to paid tier

---

## 📚 Full Guide

For detailed instructions, see: **`DEPLOYMENT_GUIDE_YUMVUHORE.md`**

---

**Time Estimate**: ~15 minutes total
**Difficulty**: Easy
**Cost**: Free (both services offer free tiers)
