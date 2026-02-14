# API Testing Guide

This document provides examples for testing the Smart Energy Meter API using Postman and curl.

## Prerequisites

1. Start the API server:
   ```bash
   cd api-server
   npm install
   npm start
   ```

2. The server should be running on `http://localhost:3000`

## Testing with cURL

### 1. Health Check

```bash
curl -X GET http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "uptime": 3600.5
}
```

---

### 2. Send Energy Data (POST)

```bash
curl -X POST http://localhost:3000/api/energy-data \
  -H "Content-Type: application/json" \
  -d '{
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
    "timestamp": 1703123456789
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Energy data received successfully",
  "data": {
    "meterNumber": "0215002079873",
    "token": "18886583547834136861",
    "remainingKwh": 4.523,
    "receivedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

---

### 3. Send Energy Data (Minimal Required Fields)

```bash
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

---

### 4. Get All Energy Data

```bash
curl -X GET http://localhost:3000/api/energy-data
```

**With Filters:**
```bash
curl -X GET "http://localhost:3000/api/energy-data?meterNumber=0215002079873&limit=5"
```

---

### 5. Get Latest Data for Specific Meter

```bash
curl -X GET http://localhost:3000/api/energy-data/0215002079873
```

---

### 6. Test Error Cases

#### Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "Missing required fields: meterNumber and token are required"
}
```

#### Invalid Meter Number Format
```bash
curl -X POST http://localhost:3000/api/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "12345",
    "token": "18886583547834136861",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "sessionDuration": 120
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "Invalid meter number format. Must be 13 digits"
}
```

#### Invalid Token Format
```bash
curl -X POST http://localhost:3000/api/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873",
    "token": "12345",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "sessionDuration": 120
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "Invalid token format. Must be 20 digits"
}
```

---

## Testing with Postman

### Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Import the `Smart_Energy_Meter_API.postman_collection.json` file

### Manual Setup

#### 1. Health Check

- **Method**: GET
- **URL**: `http://localhost:3000/api/health`
- **Headers**: None required

#### 2. Send Energy Data

- **Method**: POST
- **URL**: `http://localhost:3000/api/energy-data`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):
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
  "timestamp": 1703123456789
}
```

#### 3. Get Energy Data

- **Method**: GET
- **URL**: `http://localhost:3000/api/energy-data?meterNumber=0215002079873&limit=10`
- **Headers**: None required

#### 4. Get Meter Data

- **Method**: GET
- **URL**: `http://localhost:3000/api/energy-data/0215002079873`
- **Headers**: None required

---

## Test Scenarios

### Scenario 1: Normal Operation Flow

1. Send initial energy data when token is activated
2. Send periodic updates (every 30 seconds)
3. Send final data when energy is exhausted

### Scenario 2: Multiple Meters

1. Send data from Meter 1: `0215002079873`
2. Send data from Meter 2: `0215002079874`
3. Retrieve data for specific meter

### Scenario 3: Error Handling

1. Test missing fields
2. Test invalid formats
3. Test non-existent meter queries

---

## Automated Testing Script

Create a test script `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "Testing Health Check..."
curl -s -X GET $BASE_URL/health | jq .

echo -e "\nTesting POST Energy Data..."
curl -s -X POST $BASE_URL/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873",
    "token": "18886583547834136861",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "sessionDuration": 120,
    "voltage": 230.5,
    "current": 5.2,
    "power": 1200.0
  }' | jq .

echo -e "\nTesting GET Energy Data..."
curl -s -X GET "$BASE_URL/energy-data?limit=5" | jq .

echo -e "\nTesting GET Meter Data..."
curl -s -X GET $BASE_URL/energy-data/0215002079873 | jq .
```

Make it executable:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Expected Test Results

All tests should return `success: true` for valid requests and appropriate error messages for invalid requests.

---

## Troubleshooting

1. **Connection Refused**: Ensure the API server is running
2. **404 Not Found**: Check the endpoint URL
3. **400 Bad Request**: Verify JSON format and required fields
4. **500 Internal Server Error**: Check server logs for details
