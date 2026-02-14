# Backend API Status Check

## Quick Test URLs

### Health Check Endpoint
Open in browser:
```
https://smartmeter-jdw0.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "Server is running"
}
```

### Other Test Endpoints

1. **Health Check**
   - URL: `https://smartmeter-jdw0.onrender.com/api/health`
   - Method: GET
   - No authentication required

2. **Energy Data (Latest)**
   - URL: `https://smartmeter-jdw0.onrender.com/api/energy-data/0215002079873`
   - Method: GET
   - Replace `0215002079873` with your meter number
   - Requires authentication (JWT token)

3. **Energy Data List**
   - URL: `https://smartmeter-jdw0.onrender.com/api/energy-data`
   - Method: GET
   - Requires authentication

## Browser Testing

### Method 1: Direct URL
1. Open your browser
2. Navigate to: `https://smartmeter-jdw0.onrender.com/api/health`
3. You should see: `{"status":"Server is running"}`

### Method 2: Browser Developer Tools
1. Open browser (F12 to open DevTools)
2. Go to **Console** tab
3. Run this JavaScript:
   ```javascript
   fetch('https://smartmeter-jdw0.onrender.com/api/health')
     .then(res => res.json())
     .then(data => console.log('API Status:', data))
     .catch(err => console.error('Error:', err));
   ```

### Method 3: Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Navigate to: `https://smartmeter-jdw0.onrender.com/api/health`
4. Check the response status and data

## PowerShell Testing

```powershell
# Health check
Invoke-WebRequest -Uri "https://smartmeter-jdw0.onrender.com/api/health" -Method GET

# Get response content
$response = Invoke-WebRequest -Uri "https://smartmeter-jdw0.onrender.com/api/health"
$response.Content
```

## cURL Testing (if available)

```bash
curl https://smartmeter-jdw0.onrender.com/api/health
```

## Status Indicators

### ✅ Server Running
- Status Code: 200
- Response: `{"status":"Server is running"}`

### ❌ Server Down
- Status Code: 503, 500, or timeout
- Response: Error message or no response

### ⚠️ CORS Issues
- Status Code: 200 (but blocked by browser)
- Console Error: "CORS policy" or "Access-Control-Allow-Origin"

## Troubleshooting

### If API is not responding:
1. Check Render dashboard: https://dashboard.render.com
2. Verify service is running
3. Check service logs for errors
4. Verify MongoDB connection

### If CORS errors:
1. Check `allowedOrigins` in `server/index.js`
2. Verify your domain is in the list
3. Check CORS headers in response

## Current Configuration

- **Backend URL**: `https://smartmeter-jdw0.onrender.com/api`
- **Health Endpoint**: `https://smartmeter-jdw0.onrender.com/api/health`
- **Frontend**: `https://smartmeter-coral.vercel.app`
- **ESP32 API**: `https://smartmeter-jdw0.onrender.com/api`
