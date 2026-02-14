# Test Data Function - Usage Guide

## Overview

A test data function has been added to send simulated energy meter data to the API server for testing purposes.

## Function: `sendTestDataToAPI()`

This function sends a complete test payload with all required fields to your API server.

### Test Data Payload

```json
{
  "meterNumber": "0215002079873",
  "token": "18886583547834136861",
  "clientName": "YUMVUHORE",
  "clientTIN": "",
  "clientPhone": "0782946444",
  "remainingKwh": 4.523,
  "sessionDuration": 120,
  "voltage": 230.5,
  "current": 5.2,
  "power": 1200.0,
  "totalEnergy": 150.5,
  "frequency": 50.0,
  "powerFactor": 0.95,
  "timestamp": <current_millis>
}
```

## How to Use

### Method 1: Press Button B on Keypad

1. Power on the ESP32
2. Wait for WiFi connection
3. Press **Button B** on the keypad
4. Test data will be sent to the server
5. Check Serial Monitor for response

### Method 2: Send on Startup (Optional)

Uncomment this line in `setup()` function (around line 150):

```cpp
// Uncomment to send test data on startup
sendTestDataToAPI();
```

### Method 3: Call from Code

You can call the function from anywhere in your code:

```cpp
sendTestDataToAPI();
```

## Serial Monitor Output

When test data is sent, you'll see:

```
========================================
Sending TEST data to API:
{"meterNumber":"0215002079873","token":"18886583547834136861",...}
========================================
✅ TEST - HTTP Response code: 200
Response: {"success":true,"message":"Energy data received successfully",...}
```

Or if there's an error:

```
❌ TEST - Error code: -1
Check server URL and connectivity
```

## Display Feedback

When Button B is pressed:
- **If WiFi connected**: Shows "Test data sent! Check Serial"
- **If WiFi not connected**: Shows "WiFi not connected Cannot test API"

## Server Configuration

Make sure your API server is running and accessible at:

```
http://192.168.1.100:5000/api/energy-data
```

Update `apiBaseUrl` in `src/main.cpp` if your server is at a different address.

## Testing Checklist

- [ ] WiFi is connected
- [ ] API server is running
- [ ] Server URL is correct in code
- [ ] Press Button B or uncomment startup call
- [ ] Check Serial Monitor for response
- [ ] Verify data received on server side

## Troubleshooting

### "WiFi not connected"
- Check WiFi credentials in code
- Ensure WiFi network is available
- Check Serial Monitor for connection status

### "Error code: -1"
- Server not running
- Wrong server URL
- Firewall blocking connection
- Network connectivity issue

### "HTTP Response code: 200"
- ✅ Success! Data was received by server
- Check server logs to verify data storage

## Notes

- Test data uses simulated values (not real PZEM readings)
- The function can be called multiple times
- Each call sends a new timestamp
- Button B is now dedicated to testing (was previously ignored)
