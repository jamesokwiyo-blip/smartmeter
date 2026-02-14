# Automatic Token Delivery Feature ✅

## Overview
After successfully purchasing energy, the token is automatically sent to the meter if network connection is available. If no network is available, the energy token can be inserted manually using the keypad.

## How It Works

### 1. **Automatic Token Delivery (Network Available)**
- When a purchase is completed, the token is stored in the database with `tokenApplied: false`
- ESP32 polls the server every 10 seconds for pending tokens
- When a pending token is found, it's automatically applied to the meter
- The meter displays "Token Applied! From Server" notification
- The token is confirmed on the server as applied

### 2. **Manual Token Entry (Network Unavailable)**
- User can manually enter the 20-digit token using the keypad
- Token is validated locally first
- If not found locally and WiFi is available, the meter checks the server
- If not found locally and no WiFi, the token is rejected
- Manual entry works even when offline (if token was previously synced)

### 3. **Hybrid Mode**
- If manual entry fails locally but WiFi is available, the meter automatically checks the server
- This allows manual entry to work even if the token wasn't in the local database

## Backend API Endpoints

### GET `/api/purchases/pending-token/:meterNumber`
- **Purpose**: Get pending token for a meter
- **Auth**: None (ESP32 endpoint)
- **Response**:
  ```json
  {
    "success": true,
    "hasToken": true,
    "token": {
      "tokenNumber": "18886583547834136861",
      "kwhAmount": 5.0,
      "amountRWF": 625,
      "purchaseId": "507f1f77bcf86cd799439011",
      "createdAt": "2026-02-12T10:00:00.000Z"
    }
  }
  ```

### POST `/api/purchases/confirm-token/:purchaseId`
- **Purpose**: Confirm that a token was applied to the meter
- **Auth**: None (ESP32 endpoint)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token confirmed as applied",
    "purchase": {
      "id": "507f1f77bcf86cd799439011",
      "meterNumber": "0215002079873",
      "tokenNumber": "18886583547834136861",
      "status": "COMPLETED"
    }
  }
  ```

## ESP32 Functions

### `checkForPendingToken()`
- Checks server for pending tokens every 10 seconds
- Only runs when `STATE_READY` and WiFi connected
- Automatically applies token if found

### `applyTokenFromServer(tokenNumber, kwhAmount, purchaseId)`
- Applies token received from server
- Sets meter to `STATE_RUNNING`
- Confirms token on server
- Sends initial energy data to API

### `validateTokenFromServer(tokenNumber)`
- Validates manually entered token with server
- Used when local validation fails but WiFi is available
- Automatically applies token if valid

## Database Changes

### Purchase Model
Added fields:
- `tokenApplied` (Boolean): Whether token was applied to meter
- `tokenAppliedAt` (Date): When token was applied

### Database Functions
- `getPendingTokenForMeter(meterNumber)`: Gets most recent unapplied token
- `confirmTokenApplied(purchaseId)`: Marks token as applied

## User Flow

### Scenario 1: Network Available
1. User purchases energy on dashboard
2. Token is created and stored with `tokenApplied: false`
3. ESP32 polls server and finds pending token
4. Token is automatically applied
5. Meter starts running
6. Token is confirmed on server

### Scenario 2: Network Unavailable
1. User purchases energy on dashboard
2. Token is created and stored
3. ESP32 cannot connect to server
4. User manually enters token via keypad
5. Token is validated (if previously synced locally) or rejected
6. If WiFi becomes available, token can be validated from server

### Scenario 3: Manual Entry with Network
1. User manually enters token via keypad
2. Token not found in local database
3. ESP32 checks server automatically
4. If found on server, token is applied
5. Meter starts running

## Configuration

### ESP32 Configuration
- **Token Check Interval**: 10 seconds (`TOKEN_CHECK_INTERVAL_MS`)
- **API Base URL**: `http://192.168.1.100:5000/api`
- **Meter Number**: `0215002079873` (13 digits)

### Polling Behavior
- Only polls when `STATE_READY` (not running, not entering token)
- Stops polling when meter is running
- Resumes polling when meter returns to ready state

## Testing

### Test Automatic Delivery
1. Make a purchase on the dashboard
2. Ensure ESP32 is connected to WiFi
3. Wait up to 10 seconds
4. Meter should automatically apply token and start running

### Test Manual Entry
1. Disconnect WiFi or turn off network
2. Make a purchase on the dashboard
3. Manually enter the 20-digit token via keypad
4. Token should be applied (if previously synced) or rejected

### Test Hybrid Mode
1. Make a purchase on the dashboard
2. Manually enter token (not in local database)
3. Ensure WiFi is connected
4. Meter should check server and apply token automatically

## Error Handling

### Network Errors
- If server is unreachable, manual entry still works
- If token check fails, it retries on next interval
- No blocking - meter continues normal operation

### Token Validation
- Local validation first (fast)
- Server validation if local fails (slower, requires network)
- Clear error messages on display

## Summary

✅ **Automatic token delivery** when network is available  
✅ **Manual token entry** when network is unavailable  
✅ **Hybrid validation** - checks server if local validation fails  
✅ **Non-blocking** - meter continues operation regardless of network status  
✅ **User-friendly** - clear notifications and error messages  

The system gracefully handles both online and offline scenarios!
