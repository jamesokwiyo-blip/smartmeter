# Setup Guide - Smart Energy Meter System

## Quick Start

### 1. ESP32 Configuration

Edit `src/main.cpp` and update these values:

```cpp
// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* apiBaseUrl = "http://your-server-ip:3000/api";  // Use your server's IP

// Meter Configuration
const char* METER_NUMBER = "0215002079873";
const char* CLIENT_NAME = "YUMVUHORE";
const char* CLIENT_PHONE = "0782946444";
```

### 2. Build and Upload

```bash
pio run -t upload
```

### 3. Start API Server

```bash
cd api-server
npm install
npm start
```

### 4. Test API

```bash
# Health check
curl http://localhost:3000/api/health

# Send test data
curl -X POST http://localhost:3000/api/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873",
    "token": "18886583547834136861",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "sessionDuration": 120
  }'
```

## Important Notes

1. **WiFi and HTTPClient**: These are built-in ESP32 libraries, no additional installation needed
2. **API Server IP**: Use your computer's local IP address (not localhost) when configuring ESP32
3. **Token Format**: Tokens are stored without spaces but displayed with spaces for readability
4. **Meter Number**: Must be exactly 13 digits
5. **Token**: Must be exactly 20 digits

## Troubleshooting

- **WiFi not connecting**: Check SSID and password, ensure 2.4GHz network
- **API not receiving data**: Verify server IP address and firewall settings
- **Token not accepted**: Check token exists in `tokens[]` array in `main.cpp`
