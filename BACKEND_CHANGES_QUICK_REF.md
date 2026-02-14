# Backend Changes - Quick Reference

## New Features Added

### 1. Password Reset System
```javascript
// Request password reset
POST /api/auth/forgot-password
Body: { email: "user@example.com" }

// Reset password with token
POST /api/auth/reset-password
Body: { token: "jwt_token", newPassword: "newpass123" }
```

### 2. ESP32 Token Delivery
```javascript
// ESP32 checks for new tokens
GET /api/purchases/pending-token/:meterNumber

// ESP32 confirms token applied
POST /api/purchases/confirm-token/:purchaseId
```

### 3. Energy Data Collection
```javascript
// ESP32 sends energy data (no auth)
POST /api/energy-data
Body: {
  meterNumber: "0215002079873",
  token: "18886583547834136861",
  remainingKwh: 4.5,
  voltage: 230.5,
  current: 2.1,
  power: 483.5
}

// Dashboard gets energy data (auth required)
GET /api/energy-data/:meterNumber
Header: Authorization: Bearer <jwt_token>
```

## Files Created
1. `server/models/EnergyData.js` - Energy data schema
2. `server/routes/energyData.js` - Energy data endpoints
3. `BACKEND_CHANGES_APPLIED.md` - Full documentation

## Files Modified
1. `server/models/User.js` - Added resetToken fields
2. `server/models/Purchase.js` - Added tokenApplied fields
3. `server/database.js` - Added 9 new functions
4. `server/index.js` - Added energy routes & CORS
5. `server/routes/auth.js` - Added password reset
6. `server/routes/purchases.js` - Added ESP32 endpoints

## Key Validations
- Meter Number: Exactly 13 digits (e.g., `0215002079873`)
- Token Number: Exactly 20 digits (e.g., `18886583547834136861`)
- Password: Minimum 8 characters
- Reset Token: Valid for 1 hour

## Database Changes
- User: +2 fields (resetToken, resetTokenExpiry)
- Purchase: +2 fields (tokenApplied, tokenAppliedAt)
- EnergyData: New collection (17 fields)

## No Breaking Changes
All existing functionality remains unchanged and backward compatible.
