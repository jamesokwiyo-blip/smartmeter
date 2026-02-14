# Token Checking Improvements

## Overview
Improved the token checking behavior to maintain device state when no pending token is found and reduce verbose logging.

## Changes Made

### 1. **Reduced Verbose Logging**
- **Before**: Logged every "Pending token response" even when `hasToken` is false
- **After**: Only logs when a token is actually found or when there's an error
- **Result**: Serial Monitor is much cleaner, showing only meaningful messages

### 2. **Maintain State When No Pending Token**
- **Before**: Device would check for tokens but behavior was unclear when no token found
- **After**: Device maintains current state and remaining energy when no pending token is found
- **Result**: Device continues showing remaining energy from previous token while checking for new ones

### 3. **Check Tokens While Running**
- **Before**: Only checked for pending tokens when in `STATE_READY`
- **After**: Checks for pending tokens in both `STATE_READY` and `STATE_RUNNING`
- **Result**: New tokens can be automatically applied even while a token is currently running

### 4. **Additive Token Application**
- **Before**: If a token was already running, new tokens were rejected
- **After**: New tokens are added to existing remaining energy
- **Result**: Multiple purchases can accumulate energy on the meter

## Code Changes

### `checkForPendingToken()` Function
```cpp
// Removed verbose logging
// Before: Serial.println("Pending token response: " + response);
// After: Only logs when token is found or error occurs
```

### Token Checking in `loop()`
```cpp
// Before: Only checked in STATE_READY
if (state == STATE_READY && wifiConnected && WiFi.status() == WL_CONNECTED) {
  // check for tokens
}

// After: Checks in both STATE_READY and STATE_RUNNING
if ((state == STATE_READY || state == STATE_RUNNING) && wifiConnected && WiFi.status() == WL_CONNECTED) {
  // check for tokens
}
```

### `applyTokenFromServer()` Function
```cpp
// Before: Rejected tokens if already running
if (state == STATE_RUNNING) {
  Serial.println("Already running, cannot apply new token");
  return false;
}

// After: Adds energy to existing balance
if (state == STATE_RUNNING && remaining_kwh > 0) {
  remaining_kwh += kwhAmount;  // Add to existing
} else {
  remaining_kwh = kwhAmount;  // Set new
}
```

## Behavior

### When No Pending Token Found:
1. ✅ Device maintains current state (READY or RUNNING)
2. ✅ Remaining energy continues to be displayed
3. ✅ No verbose logging (silent check)
4. ✅ Continues checking every 10 seconds in background

### When Pending Token Found:
1. ✅ Logs token details
2. ✅ Applies token automatically
3. ✅ If already running: Adds energy to existing balance
4. ✅ If ready/exhausted: Starts new session

### Example Scenarios:

**Scenario 1: Token Running, No Pending Token**
- Device shows: "Remaining: 50.0 kWh"
- Checks server: No pending token
- Result: Continues showing 50.0 kWh, silently checks again in 10 seconds

**Scenario 2: Token Running, New Token Available**
- Device shows: "Remaining: 30.0 kWh"
- Checks server: Finds pending token with 80 kWh
- Result: Adds 80 kWh → Shows "Remaining: 110.0 kWh"

**Scenario 3: Ready State, No Pending Token**
- Device shows: "Ready" screen
- Checks server: No pending token
- Result: Stays in ready state, silently checks again in 10 seconds

## Serial Monitor Output

### Before (Verbose):
```
Pending token response: {"success":true,"hasToken":false,"message":"No pending token for this meter"}
Pending token response: {"success":true,"hasToken":false,"message":"No pending token for this meter"}
Pending token response: {"success":true,"hasToken":false,"message":"No pending token for this meter"}
... (repeated every 10 seconds)
```

### After (Clean):
```
Found pending token: 27242952938634495859
kWh: 80.00
Token applied from server, kWh: 80.00
Token: 27242952938634495859
Token confirmed on server
```
(Only shows when token is found or error occurs)

## Benefits

1. **Cleaner Serial Monitor**: No spam from repeated "no token" messages
2. **Better User Experience**: Device maintains state and shows remaining energy
3. **Automatic Top-ups**: New tokens can be added while meter is running
4. **Background Checking**: Silent checks don't interrupt user experience
5. **Energy Accumulation**: Multiple purchases can add energy to the meter

## Testing

To verify the improvements:

1. **No Pending Token**:
   - Monitor Serial output - should be quiet (no repeated messages)
   - Device should maintain current state and remaining energy
   - Check every 10 seconds silently

2. **Pending Token Found**:
   - Should log token details
   - Should apply token automatically
   - Should add to existing energy if already running

3. **Multiple Purchases**:
   - Purchase 1: 50 kWh → Meter shows 50 kWh
   - Purchase 2: 80 kWh → Meter shows 130 kWh (50 + 80)
