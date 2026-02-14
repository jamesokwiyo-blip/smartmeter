# Server Status

## ✅ Server is Running!

The backend server has been started successfully.

### Server Details

- **URL**: `http://localhost:5000`
- **Status**: ✅ Running
- **Port**: 5000
- **Database**: MongoDB Atlas

### Available Endpoints

1. **Health Check**
   ```
   GET http://localhost:5000/api/health
   ```

2. **Energy Data** (for ESP32)
   ```
   POST http://localhost:5000/api/energy-data
   GET  http://localhost:5000/api/energy-data
   ```

3. **Authentication**
   ```
   POST http://localhost:5000/api/auth/login
   POST http://localhost:5000/api/auth/register
   ```

4. **Purchases**
   ```
   POST http://localhost:5000/api/purchases/buy
   GET  http://localhost:5000/api/purchases/history
   ```

### Testing the Server

#### Test Health Endpoint
```powershell
curl http://localhost:5000/api/health
```

#### Test Energy Data Endpoint (from ESP32)
The ESP32 will automatically send test data on startup (since you uncommented `sendTestDataToAPI()`).

Or press **Button B** on the keypad to send test data manually.

### Network Access

To receive data from ESP32, you need to:

1. **Find your PC's local IP address**:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" under your active network adapter (e.g., `192.168.1.100`)

2. **Update ESP32 code** if needed:
   ```cpp
   const char* apiBaseUrl = "http://192.168.1.100:5000/api";
   ```

3. **Ensure firewall allows connections**:
   - Windows Firewall may need to allow Node.js/port 5000
   - Or temporarily disable firewall for testing

### Server Logs

The server will show:
- Database connection status
- Incoming API requests
- Error messages (if any)

### Next Steps

1. ✅ Server is running
2. Upload ESP32 firmware: `pio run -t upload`
3. ESP32 will send test data on startup
4. Check server console for received data
5. Check Serial Monitor on ESP32 for response

### Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

### Restarting the Server

```powershell
cd smartmeter
npm run dev:server
```
