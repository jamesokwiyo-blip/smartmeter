# Browser API Tests - Direct URL Testing

## ✅ No Authentication Required

### 1. Health Check
**URL:** `https://smartmeter-jdw0.onrender.com/api/health`

**Expected Response:**
```json
{
  "status": "Server is running"
}
```

**Test:** Just open the URL in your browser!

---

### 2. Pending Token Check (for ESP32)
**URL:** `https://smartmeter-jdw0.onrender.com/api/purchases/pending-token/0215002079873`

Replace `0215002079873` with your actual meter number.

**Expected Responses:**

**If token is pending:**
```json
{
  "success": true,
  "hasToken": true,
  "token": {
    "tokenNumber": "18886583547834136861",
    "kwhAmount": 50.0,
    "purchaseId": "507f1f77bcf86cd799439011"
  }
}
```

**If no token pending:**
```json
{
  "success": true,
  "hasToken": false,
  "message": "No pending token for this meter"
}
```

**Test:** Open in browser to check if there's a pending token for your meter.

---

## 🔒 Authentication Required (Use Browser Console)

These endpoints require a JWT token. You can test them using the browser console on your Vercel dashboard.

### Step 1: Get Your Auth Token
1. Go to: `https://smartmeter-coral.vercel.app/`
2. Login to your account
3. Open Browser Console (F12)
4. Run this to get your token:
```javascript
localStorage.getItem('authToken')
```
Copy the token value.

### Step 2: Test Endpoints in Console

#### 3. Get Latest Energy Data for Meter
```javascript
const token = 'YOUR_TOKEN_HERE';
const meterNumber = '0215002079873'; // Your meter number

fetch(`https://smartmeter-jdw0.onrender.com/api/energy-data/${meterNumber}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Energy Data:', data))
.catch(err => console.error('Error:', err));
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "meterNumber": "0215002079873",
    "token": "18886583547834136861",
    "remainingKwh": 45.5,
    "voltage": 230.5,
    "current": 5.2,
    "power": 1200.0,
    "timestamp": 1234567890000,
    "timestampFormatted": "2024-01-15T10:30:00"
  }
}
```

---

#### 4. Get Purchase History
```javascript
const token = 'YOUR_TOKEN_HERE';

fetch('https://smartmeter-jdw0.onrender.com/api/purchases/history', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Purchase History:', data))
.catch(err => console.error('Error:', err));
```

**Expected Response:**
```json
{
  "success": true,
  "purchases": [
    {
      "id": "507f1f77bcf86cd799439011",
      "date": "1/15/2024",
      "meterNumber": "0215002079873",
      "amount": 5000,
      "kwh": 40.0,
      "paymentMethod": "Mobile Money",
      "tokenNumber": "18886583547834136861",
      "status": "completed"
    }
  ]
}
```

---

#### 5. Get User Meters
```javascript
const token = 'YOUR_TOKEN_HERE';

fetch('https://smartmeter-jdw0.onrender.com/api/purchases/meters', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Meters:', data))
.catch(err => console.error('Error:', err));
```

**Expected Response:**
```json
{
  "success": true,
  "meters": [
    {
      "meterNumber": "0215002079873",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

#### 6. Get Energy Data List
```javascript
const token = 'YOUR_TOKEN_HERE';
const meterNumber = '0215002079873'; // Optional filter

fetch(`https://smartmeter-jdw0.onrender.com/api/energy-data?meterNumber=${meterNumber}&limit=10`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Energy Data List:', data))
.catch(err => console.error('Error:', err));
```

---

## 🚀 Quick Test Script (Copy & Paste)

Open browser console on your Vercel dashboard and paste this:

```javascript
// Quick API Test Script
const API_BASE = 'https://smartmeter-jdw0.onrender.com/api';
const token = localStorage.getItem('authToken');
const meterNumber = '0215002079873'; // Change to your meter number

console.log('=== API Tests ===\n');

// Test 1: Health Check
fetch(`${API_BASE}/health`)
  .then(res => res.json())
  .then(data => console.log('✅ Health:', data))
  .catch(err => console.error('❌ Health Error:', err));

// Test 2: Pending Token
fetch(`${API_BASE}/purchases/pending-token/${meterNumber}`)
  .then(res => res.json())
  .then(data => console.log('✅ Pending Token:', data))
  .catch(err => console.error('❌ Pending Token Error:', err));

// Test 3: Latest Energy Data (if token exists)
if (token) {
  fetch(`${API_BASE}/energy-data/${meterNumber}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => console.log('✅ Energy Data:', data))
    .catch(err => console.error('❌ Energy Data Error:', err));
  
  // Test 4: Purchase History
  fetch(`${API_BASE}/purchases/history`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => console.log('✅ Purchase History:', data))
    .catch(err => console.error('❌ Purchase History Error:', err));
} else {
  console.log('⚠️ No auth token found. Login first!');
}
```

---

## 📝 Notes

- **Direct Browser URLs**: Only work for GET requests without authentication
- **Authentication Required**: Use browser console on your logged-in dashboard
- **CORS**: All endpoints are configured to allow requests from your Vercel frontend
- **Error Responses**: Will show JSON error messages if something goes wrong

## 🔍 Common Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```
**Solution:** Login first and get your token.

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied to this meter"
}
```
**Solution:** Meter not registered to your account.

### 404 Not Found
```json
{
  "success": false,
  "error": "No data found for the specified meter number"
}
```
**Solution:** Meter hasn't sent any data yet, or meter number is incorrect.
