# Smart Energy Meter API Documentation

## Overview

This API receives and manages energy consumption data from Smart Energy Meters. The system uses ESP32 microcontrollers that send real-time energy measurements to the server.

## Base URL

```
http://your-server.com/api
```

For local development:
```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. In production, implement API keys or JWT tokens.

## Endpoints

### 1. POST /api/energy-data

Receives energy meter data from the ESP32 device.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

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

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `meterNumber` | string | Yes | 13-digit meter number (e.g., "0215002079873") |
| `token` | string | Yes | 20-digit token code without spaces |
| `clientName` | string | Yes | Client name |
| `clientTIN` | string | No | Client Tax Identification Number (optional) |
| `clientPhone` | string | Yes | Client phone number |
| `remainingKwh` | float | Yes | Remaining energy in kWh |
| `sessionDuration` | integer | Yes | Session duration in seconds |
| `voltage` | float | No | Voltage in volts |
| `current` | float | No | Current in amperes |
| `power` | float | No | Power in watts |
| `totalEnergy` | float | No | Total energy consumed in kWh |
| `frequency` | float | No | Frequency in Hz |
| `powerFactor` | float | No | Power factor (0-1) |
| `timestamp` | integer | No | Unix timestamp in milliseconds |

#### Response (Success - 200)

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

#### Response (Error - 400)

```json
{
  "success": false,
  "error": "Missing required fields: meterNumber and token are required"
}
```

#### Response (Error - 500)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Error details"
}
```

---

### 2. GET /api/energy-data

Retrieves energy data with optional filters.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `meterNumber` | string | No | Filter by meter number |
| `token` | string | No | Filter by token |
| `limit` | integer | No | Number of records to return (default: 10) |
| `offset` | integer | No | Number of records to skip (default: 0) |

#### Example Request

```
GET /api/energy-data?meterNumber=0215002079873&limit=5
```

#### Response (Success - 200)

```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "data": [
    {
      "meterNumber": "0215002079873",
      "token": "18886583547834136861",
      "clientName": "YUMVUHORE",
      "clientPhone": "0782946444",
      "remainingKwh": 4.523,
      "voltage": 230.5,
      "current": 5.2,
      "power": 1200.0,
      "serverTimestamp": "2024-01-15T10:30:45.123Z",
      "receivedAt": 1703123445123
    }
  ]
}
```

---

### 3. GET /api/energy-data/:meterNumber

Gets the latest energy data for a specific meter.

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `meterNumber` | string | Yes | 13-digit meter number |

#### Example Request

```
GET /api/energy-data/0215002079873
```

#### Response (Success - 200)

```json
{
  "success": true,
  "data": {
    "meterNumber": "0215002079873",
    "token": "18886583547834136861",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "voltage": 230.5,
    "current": 5.2,
    "power": 1200.0,
    "serverTimestamp": "2024-01-15T10:30:45.123Z",
    "receivedAt": 1703123445123
  }
}
```

#### Response (Error - 404)

```json
{
  "success": false,
  "error": "No data found for the specified meter number"
}
```

---

### 4. GET /api/health

Health check endpoint to verify API status.

#### Response (Success - 200)

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "uptime": 3600.5
}
```

---

## Data Format Specifications

### Meter Number Format
- **Length**: 13 digits
- **Example**: `0215002079873`
- **Validation**: Must match regex `/^\d{13}$/`

### Token Format
- **Length**: 20 digits
- **Display Format**: `1888 6583 5478 3413 6861` (with spaces)
- **API Format**: `18886583547834136861` (without spaces)
- **Validation**: Must match regex `/^\d{20}$/`

### Client Information
- **Client Name**: Required string
- **Client TIN**: Optional string (Tax Identification Number)
- **Client Phone**: Required string (format: `0782946444`)

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider implementing rate limiting to prevent abuse.

---

## Data Storage

The API currently stores data in JSON files in the `data/` directory. Each file is named with a timestamp:
```
energy_data_2024-01-15T10-30-45.123Z.json
```

**Note**: For production use, implement a proper database (MongoDB, PostgreSQL, etc.)

---

## Testing

See the `TESTING.md` file for detailed testing instructions using Postman and curl.

---

## Version

**API Version**: 1.0.0

---

## Support

For issues or questions, please contact the development team.
