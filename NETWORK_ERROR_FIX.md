# Network Error Fix - Registration Issue

## Problem
Getting "Network Error" when trying to create an account.

## Root Cause
The CORS (Cross-Origin Resource Sharing) configuration in the backend server was missing port **8082**, which is where your frontend is running.

## ✅ Fix Applied

Updated `smartmeter/server/index.js` to include port 8082 in the allowed origins:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',  // ← Added this
  'http://localhost:3000',
  // ... other origins
];
```

## Next Steps

### 1. Restart the Backend Server
The backend server needs to be restarted to apply the CORS changes:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
cd smartmeter
npm run dev:server
```

### 2. Verify Frontend is Running
Make sure your frontend is running:
```powershell
cd smartmeter
npm run dev
```

### 3. Try Registration Again
1. Go to: `http://localhost:8082/create-account`
2. Fill in all fields
3. Use a **new email** (not already registered)
4. Click "Create Account"

## Your Login Credentials

**Email**: `boyumvuhore@gmail.com`  
**Full Name**: YUMVUHORE

⚠️ **Password**: Cannot be retrieved (it's securely hashed). Use "Forgot Password" feature to reset it.

## Testing the Fix

After restarting the backend, you can test:

1. **Check server health**:
   - Open: `http://localhost:5000/api/health`
   - Should show: `{"status":"Server is running"}`

2. **Check browser console** (F12):
   - No CORS errors
   - Network requests should succeed

3. **Try registration**:
   - Should work without "Network Error"

## Common Issues

### Still Getting Network Error?
1. **Backend not running**: Make sure `npm run dev:server` is active
2. **Wrong port**: Check that frontend is on port 8082
3. **Browser cache**: Clear cache or hard refresh (`Ctrl + Shift + R`)
4. **Check browser console**: Look for specific error messages

### CORS Error in Console?
- Make sure backend server was restarted after the fix
- Check that port 8082 is in the allowed origins list
- Verify frontend URL matches exactly (including http://)

## Summary

✅ **Fixed CORS configuration** - Added port 8082  
✅ **Your account**: boyumvuhore@gmail.com  
✅ **Action needed**: Restart backend server  

After restarting the backend, registration should work!
