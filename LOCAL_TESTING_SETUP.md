# 🧪 Local Server Testing Setup

## Current Configuration

### ESP32
- **API URL**: `http://192.168.1.120:5000/api`
- **PC IP**: `192.168.1.120`
- **Port**: `5000`

### Backend Server
- **URL**: `http://localhost:5000`
- **API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

### Frontend Server
- **URL**: `http://localhost:5173` (or next available port)
- **Auto-connects to**: `http://localhost:5000/api` (in dev mode)

## 🚀 Starting the Servers

### Step 1: Start Backend Server

Open a **new PowerShell terminal** and run:

```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER\smartmeter"
npm run dev:server
```

**Expected Output:**
```
✅ Connected to MongoDB Atlas
✅ Server running on http://localhost:5000
📊 Database: MongoDB Atlas
```

### Step 2: Start Frontend Server

Open **another PowerShell terminal** and run:

```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER\smartmeter"
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Upload ESP32 Code

After updating `src/main.cpp` with local IP:

```powershell
# From project root
pio run -t upload
```

## ✅ Verification Steps

### 1. Test Backend Health
Open browser: `http://localhost:5000/api/health`

Should see: `{"status":"Server is running"}`

### 2. Test Frontend
Open browser: `http://localhost:5173`

Should load the dashboard login page.

### 3. Test ESP32 Connection
1. Open Serial Monitor: `pio device monitor`
2. ESP32 should connect to WiFi
3. Check for successful API calls
4. Look for: "Energy data sent successfully" or similar

## 🔧 Troubleshooting

### Port 5000 Already in Use
```powershell
# Find and kill process on port 5000
$p = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($p) { Stop-Process -Id $p -Force }
```

### ESP32 Can't Connect
1. **Verify PC and ESP32 are on same WiFi network**
2. **Check Windows Firewall** - Allow port 5000
3. **Verify IP address** - Run `ipconfig` to confirm `192.168.1.120`
4. **Check Serial Monitor** for connection errors

### Frontend Can't Connect to Backend
1. Verify backend is running on port 5000
2. Check browser console (F12) for errors
3. Verify CORS is configured for `http://localhost:5173`

### MongoDB Connection Issues
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB Atlas connection string is valid
- Check backend console for connection errors

## 📋 Test Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running (check port in output)
- [ ] Backend health check works: `http://localhost:5000/api/health`
- [ ] Frontend loads: `http://localhost:5173`
- [ ] ESP32 code uploaded with local IP
- [ ] ESP32 connected to WiFi
- [ ] ESP32 can send data to backend
- [ ] Frontend can register/login
- [ ] Frontend can make purchases
- [ ] ESP32 receives tokens automatically

## 🔄 Switching Back to Production

When done testing, update `src/main.cpp`:

```cpp
// Change back to production
const char* apiBaseUrl = "https://smartmeter-jdw0.onrender.com/api";
```

Then upload to ESP32 again.

---

**Current Setup**: Local testing mode
**PC IP**: 192.168.1.120
**Backend**: http://localhost:5000
**Frontend**: http://localhost:5173
