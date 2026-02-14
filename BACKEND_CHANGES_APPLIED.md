# Backend Changes Applied to GitHub Repository

This document summarizes all backend changes that were applied from the local project to the GitHub repository (https://github.com/jamesokwiyo-blip/smartmeter.git).

## Date: 2024
## Applied By: Amazon Q Developer

---

## Summary of Changes

The following backend enhancements were added to support:
1. **ESP32 Smart Meter Integration** - Energy data collection from IoT devices
2. **Password Reset Functionality** - Forgot password and reset password features
3. **Automatic Token Delivery System** - ESP32 can check for and confirm tokens
4. **Enhanced Error Handling** - Better validation and error messages
5. **Improved Data Handling** - MongoDB ObjectId handling and data normalization

---

## Files Created

### 1. `server/models/EnergyData.js` (NEW)
- **Purpose**: MongoDB schema for storing energy consumption data from ESP32 devices
- **Key Fields**:
  - `meterNumber` (13 digits, indexed)
  - `token` (20 digits)
  - `clientName`, `clientTIN`, `clientPhone`
  - `remainingKwh`, `sessionDuration`
  - `voltage`, `current`, `power`, `totalEnergy`, `frequency`, `powerFactor`
  - `timestamp`, `timestampFormatted`, `serverTimestamp`, `receivedAt`
- **Features**: Automatic timestamps, compound index for efficient queries

### 2. `server/routes/energyData.js` (NEW)
- **Purpose**: API endpoints for ESP32 energy data
- **Endpoints**:
  - `POST /api/energy-data` - Receive data from ESP32 (no auth required)
  - `GET /api/energy-data` - List energy data (auth required, filtered by user's meters)
  - `GET /api/energy-data/:meterNumber` - Get latest data for specific meter (auth required)
- **Features**: 
  - Validates 13-digit meter numbers and 20-digit tokens
  - User-scoped access control
  - Detailed error messages

---

## Files Modified

### 3. `server/models/User.js`
**Changes Added**:
```javascript
resetToken: { type: String, default: null }
resetTokenExpiry: { type: Date, default: null }
```
- **Purpose**: Support password reset functionality
- **Impact**: Allows users to reset forgotten passwords securely

### 4. `server/models/Purchase.js`
**Changes Added**:
```javascript
tokenApplied: { type: Boolean, default: false }
tokenAppliedAt: { type: Date, default: null }
```
- **Purpose**: Track when ESP32 confirms token usage
- **Impact**: Enables automatic token delivery system

### 5. `server/database.js`
**Major Additions**:

#### a) Import EnergyData Model
```javascript
import EnergyData from './models/EnergyData.js';
const { ObjectId } = mongoose.Types;
```

#### b) Password Reset Functions
- `saveResetToken(userId, resetToken)` - Store reset token with 1-hour expiry
- `updatePassword(userId, passwordHash)` - Update password and clear reset token

#### c) Enhanced ObjectId Handling
- `getMetersByUserId()` - Now handles string/ObjectId conversion
- `getPurchasesByUserId()` - Now handles string/ObjectId conversion

#### d) Token Tracking Functions
- `getPendingTokenForMeter(meterNumber)` - Get unprocessed purchase for meter
- `confirmTokenApplied(purchaseId)` - Mark token as applied by ESP32

#### e) Energy Data Functions
- `createEnergyData(data)` - Store energy data from ESP32
- `getEnergyDataList({ meterNumber, token, limit, offset })` - Query energy data
- `getLatestEnergyDataByMeter(meterNumber)` - Get most recent data
- `getEnergyDataListForMeters(meterNumbers, limit, offset)` - Multi-meter query

### 6. `server/index.js`
**Changes Added**:

#### a) Import Energy Data Routes
```javascript
import energyDataRoutes from './routes/energyData.js';
```

#### b) Register Energy Data Routes
```javascript
app.use('/api/energy-data', energyDataRoutes);
```

#### c) Additional CORS Origins
```javascript
'http://localhost:8081',
'http://localhost:8082',
'https://smartmeter-gilt.vercel.app'
```

### 7. `server/routes/auth.js`
**Major Additions**:

#### a) Email Normalization in Registration
```javascript
const normalizedEmail = email.toLowerCase().trim();
```
- **Purpose**: Prevent duplicate accounts with different email cases

#### b) Enhanced Error Handling
- MongoDB duplicate key errors (11000)
- Validation errors with detailed messages
- Development vs production error messages

#### c) Password Reset Endpoints

**POST /api/auth/forgot-password**
- Accepts: `{ email }`
- Returns: Reset token (development) or success message (production)
- Security: Doesn't reveal if email exists
- Token valid for 1 hour

**POST /api/auth/reset-password**
- Accepts: `{ token, newPassword }`
- Validates: Token signature, expiry, and stored token match
- Returns: Success message
- Clears reset token after successful reset

### 8. `server/routes/purchases.js`
**Major Additions**:

#### a) Enhanced Token Generation
```javascript
// Uses crypto.randomBytes for better randomness
// Generates exactly 20 numeric digits
const digits = '0123456789';
let token20 = '';
const bytes = crypto.randomBytes(20);
for (let i = 0; i < 20; i++) {
  token20 += digits[bytes[i] % 10];
}
```

#### b) Meter Number Validation
```javascript
// Normalize and validate 13-digit meter numbers
const meterStr = String(meterNumber).replace(/\s+/g, '').replace(/[^\\d]/g, '');
if (!/^\\d{13}$/.test(meterStr)) {
  return res.status(400).json({ error: 'Meter number must be exactly 13 digits' });
}
```

#### c) Enhanced Error Handling
- Added userId validation checks
- Numeric value conversion for amounts
- Detailed error logging
- Development vs production error details

#### d) ESP32 Integration Endpoints

**GET /api/purchases/pending-token/:meterNumber**
- **Purpose**: ESP32 checks for new tokens
- **No Auth Required**: Device endpoint
- **Validates**: 13-digit meter number
- **Returns**: Token details if pending, or no-token message
- **Response**:
```javascript
{
  success: true,
  hasToken: true,
  token: {
    tokenNumber: "18886583547834136861",
    kwhAmount: 4.0,
    amountRWF: 500,
    purchaseId: "...",
    createdAt: "..."
  }
}
```

**POST /api/purchases/confirm-token/:purchaseId**
- **Purpose**: ESP32 confirms token was applied
- **No Auth Required**: Device endpoint
- **Updates**: Sets `tokenApplied: true` and `tokenAppliedAt: Date`
- **Returns**: Confirmation with purchase details

---

## API Endpoints Summary

### New Endpoints Added

#### Authentication
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

#### Energy Data (ESP32 Integration)
- `POST /api/energy-data` - Receive energy data from ESP32
- `GET /api/energy-data` - List energy data (user-scoped)
- `GET /api/energy-data/:meterNumber` - Get latest meter data

#### Token Management (ESP32 Integration)
- `GET /api/purchases/pending-token/:meterNumber` - Check for new tokens
- `POST /api/purchases/confirm-token/:purchaseId` - Confirm token applied

### Enhanced Existing Endpoints
- `POST /api/auth/register` - Now with email normalization and better errors
- `POST /api/purchases/buy` - Now validates 13-digit meter numbers
- `GET /api/purchases/history` - Enhanced error handling and logging
- `GET /api/purchases/meters` - Enhanced error handling and logging

---

## Database Schema Changes

### User Collection
```javascript
{
  fullName: String,
  email: String (unique, lowercase),
  phoneNumber: String,
  passwordHash: String,
  resetToken: String,           // NEW
  resetTokenExpiry: Date,       // NEW
  createdAt: Date
}
```

### Purchase Collection
```javascript
{
  userId: ObjectId,
  meterNumber: String (13 digits),
  amountRWF: Number,
  kwhAmount: Number,
  paymentMethod: String,
  mobileNumber: String,
  tokenNumber: String (20 digits),
  rechargeCode: String,
  status: String,
  tokenApplied: Boolean,        // NEW
  tokenAppliedAt: Date,         // NEW
  date: String,
  createdAt: Date
}
```

### EnergyData Collection (NEW)
```javascript
{
  meterNumber: String (13 digits, indexed),
  token: String (20 digits),
  clientName: String,
  clientTIN: String,
  clientPhone: String,
  remainingKwh: Number,
  sessionDuration: Number,
  voltage: Number,
  current: Number,
  power: Number,
  totalEnergy: Number,
  frequency: Number,
  powerFactor: Number,
  timestamp: Number,
  timestampFormatted: String,
  serverTimestamp: String,
  receivedAt: Number,
  createdAt: Date,              // Auto-generated
  updatedAt: Date               // Auto-generated
}
```

---

## ESP32 Integration Flow

### 1. Token Purchase Flow
```
User → Dashboard → POST /api/purchases/buy
  ↓
Server creates purchase with tokenApplied: false
  ↓
ESP32 → GET /api/purchases/pending-token/:meterNumber
  ↓
Server returns token if available
  ↓
ESP32 applies token locally
  ↓
ESP32 → POST /api/purchases/confirm-token/:purchaseId
  ↓
Server marks tokenApplied: true
```

### 2. Energy Data Flow
```
ESP32 measures energy consumption
  ↓
ESP32 → POST /api/energy-data (every 30 seconds)
  ↓
Server validates and stores data
  ↓
Dashboard → GET /api/energy-data/:meterNumber
  ↓
Server returns latest data for user's meter
```

---

## Security Enhancements

1. **Email Normalization**: Prevents duplicate accounts with case variations
2. **Password Reset Security**: 
   - Tokens expire after 1 hour
   - Tokens are single-use (cleared after reset)
   - Doesn't reveal if email exists
3. **User-Scoped Access**: Energy data endpoints verify meter ownership
4. **Input Validation**: 
   - 13-digit meter numbers
   - 20-digit tokens
   - Required field validation
5. **Error Message Control**: Different messages for development vs production

---

## Validation Rules

### Meter Numbers
- **Format**: Exactly 13 digits
- **Example**: `0215002079873`
- **Validation**: `/^\d{13}$/`
- **Normalization**: Removes spaces and non-digit characters

### Token Numbers
- **Format**: Exactly 20 digits
- **Example**: `18886583547834136861`
- **Display Format**: `1888 6583 5478 3413 6861` (with spaces)
- **Validation**: `/^\d{20}$/`
- **Generation**: Cryptographically random using `crypto.randomBytes()`

### Passwords
- **Minimum Length**: 8 characters
- **Hashing**: bcrypt with 10 rounds
- **Reset Token**: JWT with 1-hour expiry

---

## Error Handling Improvements

### Before
```javascript
res.status(500).json({ error: 'Registration failed' });
```

### After
```javascript
// Specific error for duplicate email
if (error.code === 11000) {
  return res.status(400).json({ error: 'Email already registered' });
}

// Validation errors with details
if (error.name === 'ValidationError') {
  const messages = Object.values(error.errors).map(e => e.message);
  return res.status(400).json({ error: messages.join(', ') });
}

// Environment-aware error messages
const errorMessage = process.env.NODE_ENV === 'development' 
  ? `Registration failed: ${error.message}` 
  : 'Registration failed. Please try again.';
```

---

## Testing Recommendations

### 1. Password Reset Flow
```bash
# Request reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Reset password
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<reset_token>","newPassword":"newpass123"}'
```

### 2. ESP32 Token Flow
```bash
# Check for pending token
curl http://localhost:5000/api/purchases/pending-token/0215002079873

# Confirm token applied
curl -X POST http://localhost:5000/api/purchases/confirm-token/<purchase_id>
```

### 3. Energy Data Flow
```bash
# Send energy data (ESP32)
curl -X POST http://localhost:5000/api/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber":"0215002079873",
    "token":"18886583547834136861",
    "remainingKwh":4.5,
    "voltage":230.5,
    "current":2.1,
    "power":483.5
  }'

# Get latest data (Dashboard)
curl http://localhost:5000/api/energy-data/0215002079873 \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Deployment Notes

### Environment Variables Required
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

### CORS Configuration
The server now accepts requests from:
- `http://localhost:5173` (Vite dev)
- `http://localhost:8080`, `8081`, `8082` (Alternative ports)
- `http://localhost:3000` (React dev)
- `https://smartmeter-jdw0.onrender.com` (Render deployment)
- `https://smartmeter-coral.vercel.app` (Vercel staging)
- `https://smartmeter-gilt.vercel.app` (Vercel production)
- Any `*.vercel.app` or `*.netlify.app` domain

### Database Indexes
Ensure these indexes exist for optimal performance:
```javascript
// EnergyData collection
db.energydatas.createIndex({ meterNumber: 1, createdAt: -1 })

// User collection (auto-created)
db.users.createIndex({ email: 1 }, { unique: true })

// Meter collection (auto-created)
db.meters.createIndex({ meterNumber: 1 }, { unique: true })
```

---

## Breaking Changes

**None** - All changes are backward compatible. Existing functionality remains unchanged.

---

## Future Enhancements (Not Implemented)

1. Email service integration for password reset
2. SMS notifications for token delivery
3. Real-time WebSocket updates for energy data
4. Token expiration and renewal system
5. Multi-factor authentication
6. Rate limiting for API endpoints
7. API key authentication for ESP32 devices
8. Data aggregation and analytics endpoints

---

## Files Not Modified (Frontend)

As requested, no frontend files were modified. The following remain unchanged:
- All files in `src/` directory
- All React components
- All TypeScript files
- All styling files
- `package.json` (frontend dependencies)

---

## Verification Checklist

- [x] EnergyData model created
- [x] Energy data routes created
- [x] Password reset fields added to User model
- [x] Token tracking fields added to Purchase model
- [x] Database functions updated
- [x] Server index updated with new routes
- [x] Auth routes enhanced with password reset
- [x] Purchase routes enhanced with ESP32 endpoints
- [x] CORS origins updated
- [x] Error handling improved
- [x] Input validation enhanced
- [x] Documentation created

---

## Contact

For questions about these changes, refer to:
- API Documentation: `API_DOCUMENTATION.md`
- Testing Guide: `TESTING.md`
- README: `README.md`

---

**End of Backend Changes Summary**
