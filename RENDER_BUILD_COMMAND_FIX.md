# 🔧 Render.com Build Command Fix

## ❌ Error You're Seeing

```
npm error path /opt/render/project/src/smartmeter/package.json
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

## 🔍 Problem

The build command `npm install` is running in the wrong directory. Render is:
1. Setting Root Directory to `smartmeter/server` ✅
2. But running `npm install` in `smartmeter/` ❌ (should be in `smartmeter/server/`)

## ✅ Solution

Update the **Build Command** in Render.com settings:

### Current (Wrong):
```
npm install
```

### Correct:
```
cd server && npm install
```

**OR** if Root Directory is already `smartmeter/server`, then:
```
npm install
```

But since the error shows it's looking in `smartmeter/`, you need to either:

### Option 1: Change Build Command (Recommended)
**Build Command**: `cd server && npm install`

This will:
1. Change to the `server` directory (relative to Root Directory)
2. Run `npm install` there

### Option 2: Adjust Root Directory
If Root Directory is `smartmeter`, then:
- **Root Directory**: `smartmeter/server`
- **Build Command**: `npm install`

## 🛠️ How to Fix in Render.com

1. **Go to Render.com Dashboard**
2. **Click on your service**
3. **Go to "Settings" tab**
4. **Find "Build Command"**
5. **Change it to**: `cd server && npm install`
6. **Verify "Root Directory" is**: `smartmeter/server`
7. **Click "Save Changes"**
8. **Manual Deploy** → "Deploy latest commit"

## 📝 Complete Settings

Here are the correct settings:

**Basic Settings:**
- **Root Directory**: `smartmeter/server`
- **Build Command**: `cd server && npm install` **OR** just `npm install` (if Root Directory is correct)
- **Start Command**: `npm start` **OR** `node index.js`

**Wait!** If Root Directory is `smartmeter/server`, then the build command should just be `npm install` (no `cd server` needed).

## 🔍 Debugging Steps

1. **Check your GitHub repo structure:**
   - Go to: `https://github.com/YUMVUHORE/smartmeter`
   - Verify: Does `smartmeter/server/package.json` exist?

2. **Check Root Directory setting:**
   - In Render.com, go to Settings
   - What is Root Directory set to?
   - If it's `smartmeter/server` → Build Command should be: `npm install`
   - If it's `smartmeter` → Build Command should be: `cd server && npm install`

3. **Most likely fix:**
   - **Root Directory**: `smartmeter/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## ✅ Verification

After fixing, the build should show:
```
==> Running build command 'npm install'...
==> Installing dependencies...
==> Build succeeded
==> Starting service...
```

## 🆘 Alternative: Check if package.json exists

If `smartmeter/server/package.json` doesn't exist in your GitHub repo:
1. Make sure you've committed and pushed `smartmeter/server/package.json`
2. Verify it exists: `https://github.com/YUMVUHORE/smartmeter/tree/main/smartmeter/server`
3. If missing, create it (I've already created it for you locally)

---

**Most Common Fix**: 
- Root Directory: `smartmeter/server`
- Build Command: `npm install` (no `cd` needed since Root Directory is already set)
