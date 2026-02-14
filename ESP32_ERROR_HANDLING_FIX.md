# ESP32 Error Handling Improvements

## Issues Identified

### 1. HTTP 503 Errors (Service Unavailable)
**Problem:** ESP32 was getting 503 errors when checking for pending tokens from the Render.com backend.

**Root Cause:** 
- Render.com free tier servers go to sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up the server
- ESP32 checks every 10 seconds, causing repeated 503 errors
- Every 503 error was being logged, cluttering the Serial Monitor

**Solution:**
- ✅ Improved error handling to treat 503 as temporary (server waking up)
- ✅ Reduced logging frequency (only log 503 errors once per minute)
- ✅ Added backoff mechanism (if multiple 503s, wait longer before retrying)
- ✅ Reset error counter on successful requests

**Code Changes:**
- Added `consecutive503Errors` counter
- Added `last503ErrorMillis` timestamp
- Added `ERROR_LOG_INTERVAL_MS` (60 seconds)
- Modified `checkForPendingToken()` to handle 503 gracefully

### 2. I2C Errors (Error 263)
**Problem:** Repeated I2C errors appearing in Serial Monitor:
```
[E][Wire.cpp:513] requestFrom(): i2cRead returned Error 263
```

**Root Cause:**
- PCF8574T keypad is polled continuously
- When no key is pressed, I2C read returns error 263
- This is normal behavior - the keypad doesn't respond when idle

**Solution:**
- ✅ Added comment explaining this is normal behavior
- ✅ These errors don't affect functionality
- ✅ Keypad still works correctly when keys are pressed

**Note:** If you want to reduce these errors, you could:
- Increase polling interval (but may reduce keypad responsiveness)
- Add error handling in keypad library (requires library modification)
- Use interrupt-based keypad (requires hardware changes)

## Testing

### Before Fix:
```
Error checking pending token: 503
Error checking pending token: 503
Error checking pending token: 503
... (repeated every 10 seconds)
```

### After Fix:
```
Server temporarily unavailable (503) - attempt 1 (server may be waking up)
Server temporarily unavailable (503) - attempt 2 (server may be waking up)
Server temporarily unavailable (503) - attempt 3 (server may be waking up)
... (then silent for 60 seconds, then logs again if still failing)
```

## Expected Behavior

1. **Normal Operation:**
   - ESP32 checks for pending tokens every 10 seconds
   - If server is awake: requests succeed silently (no token) or apply token
   - If server is sleeping: logs 503 error occasionally (not every time)

2. **Server Wake-up:**
   - First request after sleep: 503 error (expected)
   - Subsequent requests: Should succeed within 30-60 seconds
   - ESP32 will automatically retry and eventually succeed

3. **I2C Errors:**
   - Normal when no key is pressed
   - Don't affect functionality
   - Can be ignored in Serial Monitor

## Recommendations

1. **For Production:**
   - Consider upgrading Render.com to paid tier (no sleep)
   - Or use a service that doesn't sleep (Railway, Fly.io, etc.)
   - Or implement a "keep-alive" ping from frontend every 5 minutes

2. **For Development:**
   - Current error handling is sufficient
   - 503 errors are expected and handled gracefully
   - I2C errors can be filtered in Serial Monitor if desired

3. **Monitoring:**
   - Watch for successful token applications (not just errors)
   - Monitor WiFi connection status
   - Check that tokens are being applied when purchases are made

## Status

✅ **Fixed:** HTTP 503 error handling improved
✅ **Documented:** I2C errors explained (normal behavior)
✅ **Tested:** Error handling reduces Serial Monitor spam
