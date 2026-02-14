# Compatibility Analysis: Smart Meter Firmware, API Server & Smartmeter App

This document analyses compatibility between:
1. **ESP32 firmware** (`src/main.cpp`) – the physical smart meter
2. **API server** (`api-server/`) – backend that receives meter data
3. **Smartmeter web app** (`smartmeter/`) – frontend and its backend

---

## 1. ESP32 Firmware (`src/main.cpp`) ↔ API Server (`api-server/server.js`)

### Verdict: **Fully compatible**

The firmware and api-server use the same endpoint, HTTP method, and payload contract.

### 1.1 Endpoint & URL

| Aspect | Firmware (main.cpp) | API Server |
|--------|---------------------|------------|
| Base URL | `apiBaseUrl` = `"http://your-server.com/api"` (configurable) | Serves at `/api` (e.g. `http://localhost:3000/api`) |
| Path | `url = apiBaseUrl + "/energy-data"` → `.../api/energy-data` | `POST /api/energy-data` |
| Method | `http.POST(jsonPayload)` | `app.post('/api/energy-data', ...)` |

**Action:** Set `apiBaseUrl` on the ESP32 to your api-server address, e.g. `http://YOUR_IP:3000/api` (no trailing slash).

### 1.2 Request payload (firmware → server)

Firmware sends (from `sendEnergyDataToAPI()`):

| Field | Type | Sent by firmware | Expected/validated by server |
|-------|------|------------------|-----------------------------|
| `meterNumber` | string | ✓ `METER_NUMBER` (13 digits) | Required, validated `^\d{13}$` |
| `token` | string | ✓ `currentToken` (20 digits) | Required, validated `^\d{20}$` |
| `clientName` | string | ✓ | Optional (stored) |
| `clientTIN` | string | Only if `strlen(CLIENT_TIN) > 0` | Optional (stored) |
| `clientPhone` | string | ✓ | Optional (stored) |
| `remainingKwh` | float | ✓ | Optional (stored) |
| `sessionDuration` | number | ✓ (seconds) | Optional (stored) |
| `voltage` | float | ✓ (if valid) | Optional (stored) |
| `current` | float | ✓ (if valid) | Optional (stored) |
| `power` | float | ✓ (if valid) | Optional (stored) |
| `totalEnergy` | float | ✓ (if valid) | Optional (stored) |
| `frequency` | float | ✓ (if valid) | Optional (stored) |
| `powerFactor` | float | ✓ (if valid) | Optional (stored) |
| `timestamp` | number | ✓ `millis()` (ms since boot) | Optional (stored) |

All server validations match firmware behaviour:
- Meter number: 13 digits (e.g. `"0215002079873"`).
- Token: 20 digits, no spaces (firmware sends `currentToken` from `tokenWithoutSpaces`).
- Data is only sent when `state == STATE_RUNNING`, so `token` is always set.

### 1.3 Headers & format

- Firmware: `Content-Type: application/json`, body = JSON.
- Server: `bodyParser.json()` and no extra required headers.

Compatible.

### 1.4 Response handling

- Firmware: Logs HTTP code and response body; does not branch on response content.
- Server: Returns `200` with `{ success: true, message, data }` on success, `400`/`500` with error body on failure.

No compatibility issues; firmware can later use status code or `success` for retries or UI.

### 1.5 Minor notes

- **`timestamp`**: Firmware sends `millis()` (time since ESP32 boot). Server adds `serverTimestamp` and `receivedAt`. Fine for storage; for real-time ordering use server time.
- **WiFi/offline**: Firmware skips API calls when `!wifiConnected`; no change needed on server.

---

## 2. Smartmeter Web App vs API Server

### 2.1 Current architecture

- **smartmeter frontend** (`smartmeter/src/`):  
  - Uses `VITE_API_URL` (default `https://smartmeter-jdw0.onrender.com/api`).  
  - Calls only **auth** and **purchases** APIs (see `smartmeter/src/lib/api.ts`):  
    - `authAPI`: `/auth/register`, `/auth/login`  
    - `purchasesAPI`: `/purchases/buy`, `/purchases/history`, `/purchases/profile`, `/purchases/meters`  
  - **Does not call** `api-server` or any `/api/energy-data` endpoint.

- **smartmeter server** (`smartmeter/server/`):  
  - Express + MongoDB, port 5000.  
  - Mounts `/api/auth` and `/api/purchases`.  
  - **Does not** expose `/api/energy-data`; it is a separate backend from `api-server`.

- **api-server** (`api-server/`):  
  - Standalone Express app, port 3000.  
  - Only endpoints: `POST/GET /api/energy-data`, `GET /api/energy-data/:meterNumber`, `GET /api/health`.  
  - No auth, no MongoDB; file-based storage.  
  - Designed for **ESP32 firmware**, not for the smartmeter web UI.

So: **smartmeter app and api-server are not integrated**. They are compatible in the sense that they don’t conflict, but the web app does not read or display data from the api-server.

### 2.2 Compatibility if you want the web app to show meter data

To make the smartmeter app show data that the ESP32 sends to the api-server:

1. **Option A – Frontend talks to api-server as well**  
   - In `smartmeter/src/lib/api.ts`, add an `energyDataAPI` (or similar) that calls the api-server base URL (e.g. `http://localhost:3000/api` or your deployed api-server URL).  
   - Use:  
     - `GET /api/energy-data?meterNumber=...&limit=...` for list,  
     - `GET /api/energy-data/:meterNumber` for latest by meter.  
   - CORS: api-server already uses `cors()`; ensure the origin of the smartmeter frontend is allowed if you restrict CORS later.

2. **Option B – One backend**  
   - Add the same energy-data routes (and file-based or DB storage) to `smartmeter/server`, or  
   - Proxy from `smartmeter/server` to `api-server` and expose one base URL to the frontend.  
   - Then point the frontend only at the smartmeter server and add `energyDataAPI` there.

3. **Data shape**  
   - api-server GET responses return the same field names as the firmware sends (plus `serverTimestamp`, `receivedAt`).  
   - Any new frontend code that displays meter number, token, remaining KWh, voltage, power, etc. will be compatible with this shape.

---

## 3. Summary Table

| Component | Talks to | Energy-data endpoint | Compatible? |
|-----------|----------|----------------------|-------------|
| **src/main.cpp** (ESP32) | api-server | `POST /api/energy-data` | Yes |
| **api-server** | — | Implements POST/GET energy-data | N/A |
| **smartmeter frontend** | smartmeter/server (auth + purchases) | Does not use | Not integrated with api-server |
| **smartmeter/server** | MongoDB, frontend | No energy-data routes | Different backend |

---

## 4. Recommendations

1. **ESP32 + api-server**  
   - Keep as-is; they are compatible.  
   - Set `apiBaseUrl` (and WiFi) in `main.cpp` to your api-server host (e.g. `http://<LAN_IP>:3000/api`).

2. **Smartmeter app**  
   - To show live or historical meter data from the ESP32, add client-side calls to the api-server (or to a backend that proxies/stores the same data) using the existing GET energy-data API.

3. **Optional firmware improvement**  
   - Check `httpResponseCode` (e.g. 200 vs 4xx/5xx) and optionally retry or show “sync failed” on the meter UI.

4. **Optional api-server**  
   - If the smartmeter frontend will call it from a browser, consider restricting `cors()` by origin and adding rate limiting for production.

---

## 5. Quick reference: firmware config for api-server

In `src/main.cpp`:

```cpp
const char* apiBaseUrl = "http://YOUR_SERVER_IP:3000/api";  // e.g. http://192.168.1.100:3000/api
```

- Use the machine’s LAN IP (or hostname) where `api-server` runs.  
- Port must match api-server (default 3000).  
- No trailing slash; firmware appends `/energy-data`.
