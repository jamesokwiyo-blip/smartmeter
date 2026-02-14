# 🔧 Render.com Root Directory Fix

## ❌ Error You're Seeing

```
Root directory "server" does not exist
cd: /opt/render/project/src/smartmeter/server: No such file or directory
```

## 🔍 Problem

The Root Directory setting in Render.com doesn't match your repository structure.

## ✅ Solution

The correct Root Directory depends on your GitHub repository structure:

### Option 1: If Repository Contains Entire Project
If `YUMVUHORE/smartmeter` contains the full project structure:
```
smartmeter/
├── smartmeter/
│   ├── server/
│   │   ├── index.js
│   │   └── package.json
│   └── src/
└── other files...
```

**Root Directory**: `smartmeter/server`

### Option 2: If Repository IS the smartmeter Folder
If `YUMVUHORE/smartmeter` only contains the smartmeter folder contents:
```
smartmeter/  (this IS the repo root)
├── server/
│   ├── index.js
│   └── package.json
└── src/
```

**Root Directory**: `server` (just `server`, no `smartmeter/` prefix)

## 🛠️ How to Fix in Render.com

1. **Go to Render.com Dashboard**
2. **Click on your service** (the one that's failing)
3. **Go to "Settings" tab**
4. **Scroll to "Root Directory"**
5. **Update it based on your repo structure:**

   **Try Option 1 first**: `smartmeter/server`
   
   If that doesn't work, **try Option 2**: `server`

6. **Click "Save Changes"**
7. **Manual Deploy** → Click "Manual Deploy" → "Deploy latest commit"

## 🔍 How to Check Your Repository Structure

### Method 1: Check on GitHub
1. Go to: `https://github.com/YUMVUHORE/smartmeter`
2. Look at the file structure
3. If you see `smartmeter/server/index.js` → Use `smartmeter/server`
4. If you see `server/index.js` at root → Use `server`

### Method 2: Check Locally
```powershell
# If you have the repo cloned locally
cd path\to\your\repo
dir
# If you see "smartmeter" folder → Use "smartmeter/server"
# If you see "server" folder directly → Use "server"
```

## 📝 Most Likely Solution

Based on the error message showing it's looking for `smartmeter/server`, but you set it to `server`, try:

**Root Directory**: `smartmeter/server`

Then:
1. Save in Render.com
2. Manual Deploy
3. Check if it works

## ✅ Verification

After fixing, the build should show:
```
==> Installing dependencies
==> Building...
==> Starting service...
✅ Server running on port 10000
```

Instead of:
```
❌ Root directory "server" does not exist
```

## 🆘 Still Not Working?

If neither option works, check:
1. **Repository name**: Is it exactly `YUMVUHORE/smartmeter`?
2. **Branch**: Is it `main` or `master`?
3. **File exists**: Does `server/index.js` exist in your repo?
4. **Case sensitivity**: Make sure case matches exactly

## 💡 Quick Test

Create a test file in your repo to verify structure:
1. Add a file: `server/test.txt` (or `smartmeter/server/test.txt`)
2. Push to GitHub
3. Check if Render can see it
4. This will confirm the correct path

---

**Most Common Fix**: Change Root Directory from `server` to `smartmeter/server`
