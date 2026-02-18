# Smart Meter Rwanda — API Documentation

**Base URL (Production):** `https://smartmeter-jdw0.onrender.com/api`  
**Base URL (Local Dev):**   `http://localhost:5000/api`  
**Frontend (Production):** `https://smartmeter-cyan.vercel.app`  
**Repository:** `https://github.com/jamesokwiyo-blip/smartmeter`

---

## Live Status (as of last check)

| Endpoint | Method | Auth | Production Status | Notes |
|----------|--------|------|-------------------|-------|
| `/health` | GET | None | ✅ 200 OK | Server heartbeat |
| `/auth/register` | POST | None | ✅ Working | User registration |
| `/auth/login` | POST | None | ✅ Working | Returns JWT token |
| `/purchases/buy` | POST | JWT | ✅ Working | Buy electricity |
| `/purchases/history` | GET | JWT | ✅ Working | Transaction list |
| `/purchases/profile` | GET | JWT | ✅ Working | User profile |
| `/purchases/meters` | GET | JWT | ✅ Working | Registered meters |
| `/purchases/pending-token/:meterNumber` | GET | None | ✅ Working | ESP32 polls this |
| `/purchases/confirm-token/:purchaseId` | POST | None | ✅ Working | ESP32 confirms receipt |
| `/energy-data` | POST | None | ✅ Working | ESP32 sends readings |
| `/energy-data/:meterNumber` | GET | None | ⚠️ Needs redeploy | Dashboard live data |

> **Note:** `/energy-data/:meterNumber` GET returns 401 on production because
> the latest fix (removing auth from that route) hasn't been redeployed yet.
> See **Deployment** section below.

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <jwt_token>
```

Obtain a token via `POST /auth/login`.

---

## Endpoints

### 1. Health Check

```
GET /api/health
```

**Response:**
```json
{ "status": "Server is running" }
```

---

### 2. Register

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "fullName": "YUMVUHORE",
  "email": "user@example.com",
  "password": "yourpassword",
  "phoneNumber": "0782946444"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "fullName": "YUMVUHORE", "email": "user@example.com" }
}
```

---

### 3. Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "fullName": "YUMVUHORE", "email": "user@example.com" }
}
```

---

### 4. Buy Electricity

```
POST /api/purchases/buy
Authorization: Bearer <jwt>
```

**Request Body:**
```json
{
  "meterNumber": "0215002079873",
  "amountRWF": 5000,
  "paymentMethod": "MOMO",
  "mobileNumber": "0782946444"
}
```

**Response (200):**
```json
{
  "success": true,
  "purchase": {
    "id": "...",
    "meterNumber": "0215002079873",
    "amountRWF": 5000,
    "kwhAmount": 40.00,
    "tokenNumber": "73841920583761049284",
    "rechargeCode": "FD69-WZ4D",
    "status": "PENDING",
    "date": "2026-02-18"
  }
}
```

> **Token format:** 20-digit decimal string (e.g. `73841920583761049284`)  
> **Status lifecycle:** `PENDING` → `DELIVERED` (after ESP32 confirms receipt)  
> **kWh rate:** 1 kWh = 125 RWF

---

### 5. Purchase History

```
GET /api/purchases/history
Authorization: Bearer <jwt>
```

**Response (200):**
```json
{
  "success": true,
  "purchases": [
    {
      "id": "...",
      "date": "2/18/2026",
      "meterNumber": "0215002079873",
      "amount": 5000,
      "kwh": 40.00,
      "tokenNumber": "73841920583761049284",
      "rechargeCode": "FD69-WZ4D",
      "status": "DELIVERED"
    }
  ]
}
```

---

### 6. Pending Token (ESP32 polls this)

```
GET /api/purchases/pending-token/:meterNumber
```

No authentication required — called directly by the ESP32 device.

**Example:** `GET /api/purchases/pending-token/0215002079873`

**Response — token waiting (200):**
```json
{
  "success": true,
  "hasToken": true,
  "token": {
    "purchaseId": "65f1a2b3c4d5e6f7a8b9c0d1",
    "tokenNumber": "73841920583761049284",
    "kwhAmount": 40.00,
    "rechargeCode": "FD69-WZ4D"
  }
}
```

**Response — no pending token (200):**
```json
{ "success": true, "hasToken": false }
```

---

### 7. Confirm Token Delivery (ESP32 calls after applying token)

```
POST /api/purchases/confirm-token/:purchaseId
```

No authentication required — called directly by the ESP32 device.

**Example:** `POST /api/purchases/confirm-token/65f1a2b3c4d5e6f7a8b9c0d1`

**Response (200):**
```json
{ "success": true, "message": "Token confirmed as delivered" }
```

---

### 8. Receive Energy Data (ESP32 → Server)

```
POST /api/energy-data
```

No authentication required — called by the ESP32 every 30 seconds.

**Request Body:**
```json
{
  "meterNumber": "0215002079873",
  "token": "73841920583761049284",
  "clientName": "YUMVUHORE",
  "clientTIN": "1200000",
  "clientPhone": "0782946444",
  "remainingKwh": 39.971,
  "consumedKwh": 0.029,
  "sessionDuration": 120,
  "voltage": 232.4,
  "current": 0.12,
  "power": 27.8,
  "totalEnergy": 0.029,
  "frequency": 50.20,
  "powerFactor": 0.95,
  "timestamp": 1771443620000,
  "timestampFormatted": "2026-02-18T19:40:20"
}
```

> `consumedKwh` = `pzem.energy() - pzem_energy_at_session_start` (real PZEM reading)  
> `totalEnergy` = `pzem.energy()` (cumulative since meter powered on)

**Response (200):**
```json
{
  "success": true,
  "message": "Energy data received",
  "data": {
    "meterNumber": "0215002079873",
    "token": "73841920583761049284",
    "remainingKwh": 39.971,
    "receivedAt": "2026-02-18T19:40:20.979Z"
  }
}
```

---

### 9. Get Latest Energy Data (Dashboard → Server)

```
GET /api/energy-data/:meterNumber
```

No authentication required — called by the dashboard every 15 seconds.

**Example:** `GET /api/energy-data/0215002079873`

**Response — data found (200):**
```json
{
  "success": true,
  "data": {
    "meterNumber": "0215002079873",
    "token": "73841920583761049284",
    "clientName": "YUMVUHORE",
    "remainingKwh": 39.971,
    "consumedKwh": 0.029,
    "voltage": 232.4,
    "current": 0.12,
    "power": 27.8,
    "totalEnergy": 0.029,
    "frequency": 50.20,
    "powerFactor": 0.95,
    "sessionDuration": 120,
    "timestampFormatted": "2026-02-18T19:40:20",
    "serverTimestamp": "2026-02-18T19:40:20.979Z",
    "receivedAt": 1771443620979
  }
}
```

**Response — no data (404):**
```json
{ "success": false, "error": "No data found for this meter" }
```

---

## Data Flow

```
 [Dashboard/User]                [Server API]              [ESP32 Device]
       |                              |                          |
       |-- POST /purchases/buy ------>|                          |
       |<-- { tokenNumber, status:    |                          |
       |       PENDING } ------------|                          |
       |                              |<-- GET /pending-token/  |
       |                              |    0215002079873 --------|
       |                              |-- { hasToken:true, -----> |
       |                              |    tokenNumber } -------->|
       |                              |                      applies token
       |                              |<-- POST /confirm-token/  |
       |                              |    {purchaseId} ---------|
       |                              |-- status: DELIVERED ----->|
       |                              |                          |
       |                              |<-- POST /energy-data ----|
       |                              |    (every 30s) ----------|
       |-- GET /energy-data/meter --->|                          |
       |<-- live PZEM readings -------|                          |
```

---

## Deployment

### Backend (Render)

**Service:** `smartmeter-api` at `https://smartmeter-jdw0.onrender.com`

| Setting | Value |
|---------|-------|
| Repository | `jamesokwiyo-blip/smartmeter` |
| Branch | `main` |
| Root Directory | `smartmeter` |
| Build Command | `npm install` |
| Start Command | `node server/index.js` |

**Required Environment Variables (set in Render dashboard):**

| Key | Description |
|-----|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

> **To redeploy:** Render Dashboard → `smartmeter-api` → Manual Deploy → Deploy latest commit

### Frontend (Vercel)

**Service:** `smartmeter-cyan.vercel.app`

| Setting | Value |
|---------|-------|
| Repository | `jamesokwiyo-blip/smartmeter` |
| Root Directory | `smartmeter` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Framework | Vite |

**Environment Variables (set in Vercel dashboard or `vercel.json`):**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://smartmeter-jdw0.onrender.com/api` |
| `VITE_ENERGY_API_URL` | `https://smartmeter-jdw0.onrender.com/api` |

---

## Local Development

```bash
# Clone
git clone https://github.com/jamesokwiyo-blip/smartmeter.git
cd smartmeter/smartmeter

# Install & run both frontend + backend
npm install
npm run dev:both
# Frontend → http://localhost:8080
# Backend  → http://localhost:5000/api

# ESP32 local target (same WiFi network)
# In include/config.h:
# #define API_BASE_URL "http://192.168.1.120:5000/api"
```

---

## ESP32 Configuration

```cpp
// include/config.h
#define METER_NUMBER  "0215002079873"
#define CLIENT_NAME   "YUMVUHORE"
#define CLIENT_PHONE  "0782946444"

// Production
#define API_BASE_URL  "https://smartmeter-jdw0.onrender.com/api"

// Local test (same WiFi network)
// #define API_BASE_URL  "http://192.168.1.120:5000/api"
```

The ESP32 polls `GET /pending-token/:meterNumber` every **10 seconds** and sends energy data via `POST /energy-data` every **30 seconds**.
