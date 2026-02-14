# 🔧 How to Reactivate Suspended Render.com Service

## Current Status
❌ **Service Suspended**: `https://smartmeter-jdw0.onrender.com/api`
- Error: "This service has been suspended by its owner"
- ESP32 cannot connect
- Frontend cannot connect
- System is offline

## Step-by-Step Reactivation Guide

### Step 1: Access Render.com Dashboard
1. Go to: **https://dashboard.render.com**
2. **Login** with your Render.com account credentials
3. If you don't have an account, you'll need to create one or recover access

### Step 2: Find Your Service
1. In the dashboard, look for your service
2. Service name should be something like:
   - `smartmeter-jdw0`
   - `smartmeter`
   - Or check your service list
3. The service status will show: **"Suspended"** or **"Stopped"**

### Step 3: Reactivate the Service
1. **Click on the service** to open its details
2. Look for one of these buttons:
   - **"Resume"** button (most common)
   - **"Activate"** button
   - **"Start"** button
   - **"Restart"** button
3. **Click the button** to reactivate
4. Wait 1-2 minutes for the service to start

### Step 4: Verify Service is Running
After reactivation, test the health endpoint:

**In Browser:**
```
https://smartmeter-jdw0.onrender.com/api/health
```

**Expected Response:**
```json
{"status":"Server is running"}
```

**If you still see "suspended":**
- Wait another minute (service may be starting)
- Check Render dashboard for any error messages
- Verify service logs in Render dashboard

## Why Services Get Suspended

### Common Reasons:
1. **Free Tier Inactivity** (Most Common)
   - Render.com free tier services auto-suspend after 15 minutes of inactivity
   - No requests = service goes to sleep

2. **Manual Suspension**
   - Owner manually suspended the service
   - Account issues

3. **Resource Limits**
   - Exceeded free tier limits
   - Too many requests/resources used

4. **Payment Issues** (if on paid tier)
   - Payment method expired
   - Billing issues

## Prevent Future Suspensions

### Option 1: Keep-Alive Service (Recommended for Free Tier)

Create a simple keep-alive script that pings your API every 5 minutes:

**Using GitHub Actions (Free):**
1. Create `.github/workflows/keepalive.yml`:
```yaml
name: Keep-Alive Ping
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping API
        run: |
          curl -f https://smartmeter-jdw0.onrender.com/api/health || exit 1
```

2. Commit and push to your GitHub repository
3. GitHub Actions will automatically ping your API every 5 minutes

**Using UptimeRobot (Free):**
1. Go to: https://uptimerobot.com
2. Create free account
3. Add monitor:
   - Type: HTTP(s)
   - URL: `https://smartmeter-jdw0.onrender.com/api/health`
   - Interval: 5 minutes
4. This will ping your API every 5 minutes to keep it awake

**Using Render.com Cron Job:**
1. In Render dashboard, create a new "Cron Job"
2. Schedule: `*/5 * * * *` (every 5 minutes)
3. Command: `curl https://smartmeter-jdw0.onrender.com/api/health`
4. This will keep your service awake

### Option 2: Upgrade to Paid Tier
- Render.com paid tier ($7/month) doesn't auto-suspend
- Service stays online 24/7
- Better for production use

### Option 3: Migrate to Alternative Service

**Railway.app** (Recommended):
- Free tier with $5 credit/month
- No auto-suspend
- Easy deployment
- Website: https://railway.app

**Fly.io**:
- Free tier available
- No auto-suspend
- Good performance
- Website: https://fly.io

**Heroku**:
- Paid only now ($7/month)
- Very reliable
- No auto-suspend

## Temporary Workaround (While Fixing)

If you need the system working immediately:

### Use Local Server:
1. **Start local server:**
   ```powershell
   cd smartmeter
   npm run dev:server
   ```

2. **Find your PC's IP:**
   ```powershell
   ipconfig
   ```
   Look for IPv4 Address (e.g., `192.168.1.120`)

3. **Update ESP32 code:**
   ```cpp
   const char* apiBaseUrl = "http://192.168.1.120:5000/api";
   ```

4. **Upload to ESP32** and ensure ESP32 and PC are on same WiFi

5. **Update frontend** (if needed):
   - Change `VITE_API_URL` in `.env` to `http://localhost:5000/api`
   - Or use your PC's IP

## Verification Checklist

After reactivating:
- [ ] Service shows "Running" in Render dashboard
- [ ] Health endpoint returns: `{"status":"Server is running"}`
- [ ] ESP32 can connect (check Serial Monitor)
- [ ] Frontend can connect (check browser console)
- [ ] Dashboard loads data correctly
- [ ] Purchases work end-to-end

## Next Steps

1. ✅ **IMMEDIATE**: Reactivate service in Render.com dashboard
2. ✅ **VERIFY**: Test health endpoint
3. ✅ **SETUP**: Configure keep-alive to prevent future suspensions
4. ✅ **MONITOR**: Check service status regularly
5. ✅ **CONSIDER**: Upgrade to paid tier or migrate to Railway/Fly.io

## Support

If you can't reactivate:
- Check Render.com support: https://render.com/docs
- Verify account access
- Check service logs for errors
- Consider migrating to Railway.app (easier, no auto-suspend)

---

**Current Status**: Service suspended - needs reactivation in Render.com dashboard
