# 🌐 Deployment URLs Configuration

## Current Deployment URLs

### Backend (Render.com)
- **URL**: `https://smartmeter-jdw0.onrender.com`
- **API Base**: `https://smartmeter-jdw0.onrender.com/api`
- **Health Check**: `https://smartmeter-jdw0.onrender.com/api/health`

### Frontend (Vercel)
- **URL**: `https://smartmeter-cyan.vercel.app`
- **Dashboard**: `https://smartmeter-cyan.vercel.app/dashboard`

## ✅ Configuration Status

### ESP32 (`src/main.cpp`)
- ✅ **API Base URL**: `https://smartmeter-jdw0.onrender.com/api`
- Status: Already configured correctly

### Frontend (`smartmeter/src/lib/api.ts`)
- ✅ **API Base URL**: Uses `VITE_API_URL` environment variable or defaults to `https://smartmeter-jdw0.onrender.com/api`
- **Action Required**: Set `VITE_API_URL` in Vercel environment variables

### Backend CORS (`smartmeter/server/index.js`)
- ✅ **Allowed Origins**: Includes `https://smartmeter-cyan.vercel.app`
- Status: Updated to allow new Vercel URL

## 🔧 Vercel Environment Variables

Make sure these are set in Vercel dashboard:

1. Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add/Update:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://smartmeter-jdw0.onrender.com/api`
   - **Environment**: Production, Preview, Development (all)

## ✅ Verification Steps

### 1. Test Backend
```bash
curl https://smartmeter-jdw0.onrender.com/api/health
```
Expected: `{"status":"Server is running"}`

### 2. Test Frontend
- Open: `https://smartmeter-cyan.vercel.app`
- Should load without errors
- Check browser console (F12) for any API connection errors

### 3. Test Full Integration
1. Open frontend: `https://smartmeter-cyan.vercel.app`
2. Register/Login
3. Make a purchase
4. Verify ESP32 receives token automatically

## 🔄 Next Steps

1. **Update Vercel Environment Variable**:
   - Set `VITE_API_URL=https://smartmeter-jdw0.onrender.com/api` in Vercel
   - Redeploy frontend if needed

2. **Verify Backend CORS**:
   - Backend should already allow `smartmeter-cyan.vercel.app`
   - If you get CORS errors, redeploy backend

3. **Test End-to-End**:
   - Frontend → Backend connection
   - ESP32 → Backend connection
   - Token delivery flow

## 📝 Files Updated

- ✅ `src/main.cpp` - ESP32 API URL (already correct)
- ✅ `smartmeter/src/lib/api.ts` - Frontend API URL (uses env var)
- ✅ `smartmeter/server/index.js` - CORS updated for new Vercel URL

## 🆘 Troubleshooting

### Frontend can't connect to backend:
- Check `VITE_API_URL` is set in Vercel
- Verify backend is running (check health endpoint)
- Check browser console for CORS errors

### CORS errors:
- Verify `smartmeter-cyan.vercel.app` is in `allowedOrigins`
- Redeploy backend after CORS changes
- Check backend logs in Render.com dashboard

### ESP32 can't connect:
- Verify WiFi is connected
- Check `apiBaseUrl` in `src/main.cpp`
- Check Serial Monitor for connection errors
- Verify backend is accessible

---

**Last Updated**: Current deployment URLs configured
**Backend**: https://smartmeter-jdw0.onrender.com
**Frontend**: https://smartmeter-cyan.vercel.app
