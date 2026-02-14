# ESP32 + Smartmeter Backend Integration

The smartmeter backend accepts the same **energy-data** API as the standalone api-server. The ESP32 can send data directly to this backend so it appears in the web dashboard.

## ESP32 configuration

In your firmware (`src/main.cpp`), set:

```cpp
// Smartmeter backend (default port 5000). Use your server IP or hostname.
const char* apiBaseUrl = "http://YOUR_SERVER_IP:5000/api";
```

- **Local:** e.g. `http://192.168.1.100:5000/api`
- **Deployed:** e.g. `https://smartmeter-jdw0.onrender.com/api`

No code changes are required on the ESP32; the endpoint path `/energy-data` and the JSON body are unchanged.

## Flow

1. ESP32 sends `POST /api/energy-data` with meter number, token, remaining KWh, PZEM readings, etc.
2. Backend stores the payload in MongoDB and returns success.
3. Logged-in users see live data on the Dashboard for meters they own (meters are linked when they buy electricity). Remaining KWh, voltage, power, and “Last updated” come from the latest energy-data record for the selected meter.

## Meter number

- The ESP32 uses a **13-digit** meter number (e.g. `METER_NUMBER = "0215002079873"`).
- When users buy electricity in the web app, they register a meter; that meter number is stored and used to scope energy data. For data to show on the dashboard, the meter number in the app should match the one configured on the ESP32 (use 13 digits in the buy form if your utility uses 13-digit IDs).
