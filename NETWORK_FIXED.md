# Network Configuration - Fixed! ✅

## Status
✅ **PC and ESP32 are now on the same network!**

### Network Details:
- **PC IP**: `192.168.1.120`
- **ESP32 IP**: `192.168.1.136` (from Serial Monitor)
- **Network**: `192.168.1.x` (same subnet)
- **WiFi**: `Airtel_4G_SMARTCONNECT_F812`

### ESP32 Code Updated:
- **API Base URL**: `http://192.168.1.120:5000/api`
- **File**: `src/main.cpp` line 20

## Next Steps

### 1. Rebuild and Upload ESP32 Code

You need to rebuild and upload the updated code to your ESP32:

```powershell
# In PlatformIO terminal or VS Code
pio run -t upload
```

Or use PlatformIO toolbar:
- Click "Upload" button
- Or use shortcut: `Ctrl+Alt+U`

### 2. Verify Connection

After uploading, check the Serial Monitor. You should see:

**✅ Success indicators:**
```
WiFi connected!
IP address: 192.168.1.136
✅ HTTP Response code: 200
Found 0 purchases for user...
```

**❌ If you still see errors:**
```
❌ Error code: -1
Error checking pending token: -1
```

This means:
- Server might not be running
- Firewall blocking port 5000
- IP address mismatch

### 3. Test the Connection

**Test 1: Check Pending Tokens**
- ESP32 should poll every 10 seconds
- Serial Monitor should show: `HTTP Response code: 200`
- No more `Error code: -1`

**Test 2: Send Test Data**
- Press 'B' key on keypad
- Should see: `✅ TEST - HTTP Response code: 200`
- Data should appear in server console

**Test 3: Automatic Token Delivery**
1. Make a purchase on dashboard
2. Wait up to 10 seconds
3. ESP32 should automatically apply the token
4. Serial Monitor should show: `Token applied from server`

## Troubleshooting

### If Still Getting -1 Errors:

1. **Check Server is Running:**
   ```powershell
   # Should show server running
   netstat -ano | findstr :5000
   ```

2. **Check Windows Firewall:**
   - Allow port 5000 through firewall
   - Or temporarily disable firewall for testing

3. **Verify IP Address:**
   ```powershell
   ipconfig
   # Should show 192.168.1.120
   ```

4. **Test from Browser:**
   - Open: `http://192.168.1.120:5000/api/health`
   - Should show: `{"status":"Server is running"}`

### If Connection Works But No Data:

1. **Check Meter Number:**
   - ESP32 meter: `0215002079873`
   - Make sure purchases use this meter number

2. **Check Database:**
   - Verify purchases are being created
   - Check `tokenApplied` field is `false`

3. **Check Serial Monitor:**
   - Look for polling messages
   - Check for any error messages

## Expected Behavior

### When Everything Works:

1. **ESP32 Startup:**
   ```
   Connecting to WiFi: Airtel_4G_SMARTCONNECT_F812
   WiFi connected!
   IP address: 192.168.1.136
   ✅ Connected to MongoDB Atlas (server console)
   ```

2. **Token Polling (every 10 seconds):**
   ```
   HTTP Response code: 200
   Found 0 purchases for user... (or Found 1 purchase...)
   ```

3. **When Purchase is Made:**
   ```
   Found pending token: 18886583547834136861
   Token applied from server
   kWh: 5.0
   ```

4. **Energy Data Sending:**
   ```
   Sending data to API:
   HTTP Response code: 200
   ```

## Summary

✅ **Network fixed** - Both devices on same network  
✅ **IP updated** - ESP32 code uses `192.168.1.120`  
✅ **Server accessible** - Port 5000 is open  
⏳ **Action needed** - Rebuild and upload ESP32 code  

After uploading, the ESP32 should be able to:
- ✅ Connect to the server
- ✅ Check for pending tokens
- ✅ Send energy data
- ✅ Receive automatic token delivery
