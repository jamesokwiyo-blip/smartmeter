# Connection Issues - Frontend 404 and ESP32 -1 Errors

## Issue 1: Frontend 404 Error

**Error**: `GET http://localhost:5000/api/energy-data/0215001369549 404 (Not Found)`

### Possible Causes:
1. **Meter not registered to user account**
   - The meter number `0215001369549` doesn't belong to the logged-in user
   - User needs to register/add this meter to their account first

2. **No energy data for this meter**
   - Meter hasn't sent any data to the server yet
   - ESP32 needs to send data first before it can be retrieved

3. **Authentication issue**
   - Token expired or invalid
   - User needs to log in again

### Solution:
1. **Check if meter is registered:**
   - Go to Dashboard
   - Check "My Meters" section
   - If meter is not listed, you need to add it

2. **Register the meter:**
   - Make a purchase with this meter number
   - Or manually add it through the dashboard (if feature exists)

3. **Send data from ESP32:**
   - Ensure ESP32 is connected and sending data
   - Check Serial Monitor for data transmission

## Issue 2: ESP32 Connection Error -1

**Error**: `Error checking pending token: -1`

### Cause:
ESP32 cannot reach the server because they're on **different networks**:
- **ESP32 IP**: `192.168.1.136` (network: `192.168.1.x`)
- **PC IP**: `10.189.193.48` (network: `10.189.193.x`)
- **ESP32 trying to connect to**: `192.168.1.100` (doesn't exist)

### Solution:

#### Option 1: Connect PC to Same Network (Recommended)
1. **Connect PC to ESP32's WiFi:**
   - WiFi: `Airtel_4G_SMARTCONNECT_F812`
   - Password: `9B9F0F52`

2. **Find PC's new IP:**
   ```powershell
   ipconfig
   ```
   Look for IP starting with `192.168.1.x` (e.g., `192.168.1.50`)

3. **Update ESP32 code:**
   - Open `src/main.cpp`
   - Line 20: Change `192.168.1.100` to your PC's actual IP
   ```cpp
   const char* apiBaseUrl = "http://192.168.1.50:5000/api";  // Use your PC's IP
   ```

4. **Rebuild and upload:**
   ```powershell
   pio run -t upload
   ```

#### Option 2: Use PC's Current Network
1. **Connect ESP32 to PC's network:**
   - Update WiFi credentials in ESP32 code to match PC's network
   - Update `apiBaseUrl` to use PC's IP: `10.189.193.48`

2. **Update ESP32 code:**
   ```cpp
   const char* ssid = "YOUR_PC_NETWORK_NAME";
   const char* password = "YOUR_PC_NETWORK_PASSWORD";
   const char* apiBaseUrl = "http://10.189.193.48:5000/api";
   ```

## Quick Diagnostic Steps

### Check Frontend Issue:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to load meter data
4. Check the response:
   - **403**: Meter not registered to user
   - **404**: No data for this meter
   - **401**: Authentication expired

### Check ESP32 Issue:
1. Open Serial Monitor
2. Look for:
   - `WiFi connected! IP address: 192.168.1.136` ✅
   - `Error code: -1` ❌ (Network issue)
   - `HTTP Response code: 200` ✅ (Working)

## Testing After Fix

### Test Frontend:
1. Login to dashboard
2. Check if meter `0215001369549` is in "My Meters"
3. If not, make a purchase with this meter number
4. Wait for ESP32 to send data
5. Refresh dashboard - data should appear

### Test ESP32:
1. After fixing network, check Serial Monitor
2. Should see: `HTTP Response code: 200`
3. Should see: `Found X purchases for user...` (if polling works)
4. No more `Error code: -1`

## Summary

**Frontend 404**: Meter not registered or no data yet  
**ESP32 -1**: Network connectivity issue - PC and ESP32 on different networks  

**Fix**: Connect PC and ESP32 to the same network, then update IP in ESP32 code.
