# 📋 Repository Checklist for Render.com Deployment

## ✅ Required Files for Render.com

Your repository `https://github.com/YUMVUHORE/smartmeter.git` needs these files:

### 📁 Directory Structure Required:
```
smartmeter/
└── server/
    ├── package.json          ✅ REQUIRED
    ├── index.js              ✅ REQUIRED
    ├── database.js           ✅ REQUIRED
    ├── models/
    │   ├── User.js           ✅ REQUIRED
    │   ├── Purchase.js       ✅ REQUIRED
    │   ├── EnergyData.js     ✅ REQUIRED
    │   └── Meter.js          ⚠️ CHECK IF EXISTS
    └── routes/
        ├── auth.js           ✅ REQUIRED
        ├── purchases.js      ✅ REQUIRED
        └── energyData.js     ✅ REQUIRED
```

## 🔍 Files to Verify in Your GitHub Repo

### 1. Check if these exist in `smartmeter/server/`:

- [ ] `package.json` - **CRITICAL** - Must exist for npm install
- [ ] `index.js` - Main server file
- [ ] `database.js` - Database connection
- [ ] `models/User.js`
- [ ] `models/Purchase.js`
- [ ] `models/EnergyData.js`
- [ ] `models/Meter.js` - **CHECK THIS** (database.js imports it)
- [ ] `routes/auth.js`
- [ ] `routes/purchases.js`
- [ ] `routes/energyData.js`

### 2. Verify package.json content:

The `package.json` should have:
```json
{
  "name": "smartmeter-server",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongoose": "^7.5.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  }
}
```

## 🚨 Common Missing Files

### 1. Meter.js Model (Most Likely Missing)

Check if `smartmeter/server/models/Meter.js` exists. If not, create it:

```javascript
import mongoose from 'mongoose';

const meterSchema = new mongoose.Schema({
  meterNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{13}$/  // 13 digits
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Meter = mongoose.model('Meter', meterSchema);

export default Meter;
```

### 2. .gitignore (Should exclude node_modules)

Make sure `.gitignore` exists and includes:
```
node_modules/
.env
*.log
.DS_Store
```

## 📝 Commands to Check Your Repo

### Check what's in your repo:
```powershell
# Navigate to your repo
cd "path\to\your\repo"

# Check if smartmeter/server/package.json exists
Test-Path "smartmeter/server/package.json"

# List all files in server directory
Get-ChildItem -Path "smartmeter/server" -Recurse -File | Select-Object FullName
```

### If files are missing, commit them:
```powershell
# Add the server directory
git add smartmeter/server/

# Commit
git commit -m "Add server files for Render deployment"

# Push to GitHub
git push origin main
```

## ✅ Verification Steps

1. **Check GitHub directly:**
   - Go to: `https://github.com/YUMVUHORE/smartmeter/tree/main/smartmeter/server`
   - Verify `package.json` exists
   - Verify all model files exist
   - Verify all route files exist

2. **Test locally:**
   ```powershell
   cd smartmeter/server
   npm install
   npm start
   ```
   If this works locally, it should work on Render.

3. **Check Render.com settings:**
   - Root Directory: `smartmeter/server`
   - Build Command: `npm install`
   - Start Command: `npm start`

## 🔧 Quick Fix Script

If you're missing files, run this to check:

```powershell
# Check if package.json exists
if (Test-Path "smartmeter/server/package.json") {
    Write-Host "✅ package.json exists" -ForegroundColor Green
} else {
    Write-Host "❌ package.json MISSING" -ForegroundColor Red
}

# Check if index.js exists
if (Test-Path "smartmeter/server/index.js") {
    Write-Host "✅ index.js exists" -ForegroundColor Green
} else {
    Write-Host "❌ index.js MISSING" -ForegroundColor Red
}

# Check if Meter.js exists
if (Test-Path "smartmeter/server/models/Meter.js") {
    Write-Host "✅ Meter.js exists" -ForegroundColor Green
} else {
    Write-Host "⚠️ Meter.js MISSING - may need to create" -ForegroundColor Yellow
}
```

## 📤 What to Push to GitHub

Make sure these are committed and pushed:

1. ✅ `smartmeter/server/package.json` - **MOST IMPORTANT**
2. ✅ `smartmeter/server/index.js`
3. ✅ `smartmeter/server/database.js`
4. ✅ All files in `smartmeter/server/models/`
5. ✅ All files in `smartmeter/server/routes/`

## 🎯 Next Steps

1. **Verify files exist locally** (they do - I can see them)
2. **Check if they're in GitHub** (visit the repo URL)
3. **If missing, commit and push:**
   ```powershell
   git add smartmeter/server/
   git commit -m "Add server files for Render deployment"
   git push origin main
   ```
4. **Update Render.com** with correct settings
5. **Redeploy**

---

**Most Common Issue**: `package.json` not committed to GitHub. Make sure it's pushed!
