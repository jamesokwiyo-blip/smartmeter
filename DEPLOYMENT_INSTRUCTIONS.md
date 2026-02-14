# 🚀 DEPLOYMENT INSTRUCTIONS - Get 20-Digit Tokens Working

## Current Status

✅ **Repository Code**: UPDATED  
⚠️ **Live Application**: NEEDS REDEPLOY

The code in GitHub is **100% correct** and generates 20-digit numeric tokens. However, you're still seeing old alphanumeric tokens (`2BB51BFBAFAC`) because **the deployed application hasn't been updated yet**.

## Why You're Still Seeing Old Tokens

When you see:
```
Token Number: 2BB51BFBAFAC
```

This means the **deployed server** is still running the old code. The server needs to be **redeployed** to pull the latest changes from GitHub.

## 🎯 Action Required: Redeploy Your Application

### Option 1: Render.io Deployment

If you deployed to Render (as indicated by `render.yaml`):

1. Go to https://dashboard.render.com
2. Log in to your account
3. Find the **"smartmeter-api"** service
4. Click on the service name
5. Click the **"Manual Deploy"** button (top right)
6. Select **"Deploy latest commit"**
7. Wait 2-5 minutes for deployment to complete

### Option 2: Vercel Deployment

If you deployed to Vercel (as indicated by `vercel.json`):

1. Go to https://vercel.com/dashboard
2. Log in to your account
3. Find your **smartmeter** project
4. Click on the project
5. Go to the **"Deployments"** tab
6. Click **"Redeploy"** on the latest deployment
   - OR click the three dots ⋮ and select "Redeploy"
7. Wait 1-2 minutes for deployment to complete

### Option 3: Manual Server Restart

If you're running the server manually:

1. Stop the current server (Ctrl+C)
2. Pull the latest code:
   ```bash
   git pull origin main
   ```
3. Restart the server:
   ```bash
   npm run dev:server
   ```

## ✅ How to Verify It's Working

After redeployment, make a **new test purchase**. You should see:

### ✅ CORRECT (20-digit numeric):
```
Token Number: 08574635475645364537
```

### ❌ INCORRECT (old format):
```
Token Number: 2BB51BFBAFAC
```

## 🔍 Still Seeing Old Tokens?

If you still see alphanumeric tokens after redeploying:

1. **Check deployment logs** to ensure the deployment succeeded
2. **Clear your browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Verify the API endpoint** - make sure you're hitting the production server, not localhost
4. **Check environment variables** - ensure `MONGODB_URI` and `JWT_SECRET` are set correctly

## 📱 Important Notes

### Old Purchases Won't Change
- Purchases **already in the database** will keep their old alphanumeric tokens
- Only **NEW purchases** made after redeployment will have 20-digit numeric tokens

### ESP32 Meter Compatibility
- The 20-digit format matches the ESP32 meter requirements
- The meter expects tokens in format: `/^\d{20}$/` (exactly 20 digits)

## 🐛 Troubleshooting

### Problem: Deployment fails
**Solution**: Check deployment logs for errors. Common issues:
- Missing environment variables
- MongoDB connection errors
- Build errors

### Problem: Still showing old tokens after redeploy
**Solution**: 
1. Check which server URL your frontend is using
2. Verify the server actually restarted
3. Check the server logs for the new code

### Problem: Tokens not being accepted by meter
**Solution**: 
1. Ensure meter firmware is updated
2. Verify token is exactly 20 digits
3. Check meter API endpoint expects numeric tokens

## 📞 Need Help?

If you're still having issues after redeploying:

1. Check the deployment logs
2. Verify the server is running the latest code
3. Make a test purchase and check the server response
4. Review the `TOKEN_UPDATE_CONFIRMATION.md` file for technical details

---

**Repository**: https://github.com/jamesokwiyo-blip/smartmeter.git  
**Latest Commit**: `b81a355` - "Add token update confirmation document"  
**Status**: ✅ Code ready, ⚠️ awaiting redeploy
