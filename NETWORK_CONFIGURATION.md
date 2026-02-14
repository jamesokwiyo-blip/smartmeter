# Network Configuration Issue - ESP32 Cannot Connect to Server

## Problem
ESP32 is getting error code -1 when trying to connect to the API server. This means the connection is failing.

## Current Network Status

### ESP32
- **IP Address**: `192.168.1.136`
- **Network**: `192.168.1.x` subnet
- **Status**: Connected to WiFi

### PC/Server
- **IP Address**: `10.189.193.48` (Wi-Fi)
- **Network**: `10.189.193.x` subnet
- **Status**: Server running on port 5000

### Issue
**ESP32 and PC are on different networks!**
- ESP32: `192.168.1.x` network
- PC: `10.189.193.x` network

They cannot communicate directly because they're on different subnets.

## Solutions

### Solution 1: Connect PC to Same Network (Recommended)
1. Connect your PC to the same WiFi network as the ESP32
2. The network should be `192.168.1.x`
3. Find your PC's IP on that network
4. Update `apiBaseUrl` in `src/main.cpp` to use that IP

**Steps:**
1. Connect PC to WiFi: `Airtel_4G_SMARTCONNECT_F812`
2. Find PC's IP on that network:
   ```powershell
   ipconfig
   ```
   Look for IP starting with `192.168.1.x`
3. Update `src/main.cpp`:
   ```cpp
   const char* apiBaseUrl = "http://192.168.1.XXX:5000/api";  // Replace XXX with your PC's IP
   ```
4. Rebuild and upload to ESP32

### Solution 2: Use Router Port Forwarding
If you can't connect PC to the same network:
1. Configure router to forward port 5000 to PC's IP (10.189.193.48)
2. Use router's public IP or local IP in ESP32 code
3. More complex, not recommended for local testing

### Solution 3: Use ngrok or Similar Tunneling Service
1. Install ngrok: `https://ngrok.com/`
2. Create tunnel: `ngrok http 5000`
3. Use ngrok URL in ESP32 code
4. Good for testing but requires internet

### Solution 4: Change ESP32 Network
Connect ESP32 to the same network as your PC (10.189.193.x):
1. Update WiFi credentials in ESP32 code
2. Connect ESP32 to PC's network
3. Update `apiBaseUrl` to use PC's IP: `10.189.193.48`

## Quick Fix (Temporary Testing)

If you just want to test quickly:

1. **Connect PC to ESP32's network:**
   - WiFi: `Airtel_4G_SMARTCONNECT_F812`
   - Password: `9B9F0F52`

2. **Find PC's new IP:**
   ```powershell
   ipconfig
   ```
   Should show IP like `192.168.1.XXX`

3. **Update ESP32 code:**
   ```cpp
   const char* apiBaseUrl = "http://192.168.1.XXX:5000/api";
   ```

4. **Rebuild and upload to ESP32**

## Verification

After fixing, ESP32 Serial Monitor should show:
```
✅ HTTP Response code: 200
```

Instead of:
```
❌ Error code: -1
```

## Current ESP32 Configuration

In `src/main.cpp` line 20:
```cpp
const char* apiBaseUrl = "http://192.168.1.100:5000/api";
```

**This IP (192.168.1.100) doesn't match your PC's current IP (10.189.193.48)**

## Recommended Action

**Connect your PC to the same WiFi network as the ESP32**, then:
1. Find PC's IP on that network
2. Update `apiBaseUrl` in ESP32 code
3. Rebuild and upload

This is the simplest and most reliable solution for local development.
