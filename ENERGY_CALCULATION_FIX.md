# Energy Calculation Fix - Cumulative Purchases

## Problem
When a user purchases energy while previous energy is still valid (not exhausted), the dashboard was incorrectly calculating consumed energy. The old remaining energy was being moved to "consumed" instead of being added to the new purchase.

## Root Cause
1. **Dashboard optimistic update**: When a purchase was made, the dashboard optimistically added to `remainingKwh` state
2. **ESP32 data overwrite**: When `loadEnergyDataForMeter()` fetched latest data from ESP32, it would overwrite the optimistic update
3. **Timing issue**: If ESP32 hadn't applied the new token yet, the dashboard would show incorrect values
4. **Calculation logic**: The calculation `consumed = totalPurchased - remaining` was correct, but the `remaining` value was wrong due to timing

## Solution

### 1. **ESP32 - Additive Token Application** ✅ (Already Fixed)
- When a new token is applied while meter is running, ESP32 adds the new energy to existing remaining energy
- Example: 50 kWh remaining + 80 kWh purchase = 130 kWh total remaining

### 2. **Dashboard - Use ESP32 as Source of Truth**
- Removed optimistic update of `remainingKwh` when purchase is made
- Dashboard now waits for ESP32 to apply the token and update the remaining energy
- Refreshes energy data 2 seconds after purchase to get updated value from ESP32

### 3. **Calculation Logic**
- **Total Purchased**: Sum of all purchases (from purchase history)
- **Remaining**: Latest value from ESP32 (includes all applied tokens)
- **Consumed**: `Total Purchased - Remaining`
- This ensures correct calculation regardless of when tokens are applied

## Code Changes

### Dashboard (`DashboardNew.tsx`)

**Before:**
```typescript
// Optimistically update remaining energy
setRemainingKwh(prev => prev + purchasedKwh);
```

**After:**
```typescript
// Don't optimistically update - let ESP32 be the source of truth
// Refresh energy data after purchase to get updated value from ESP32
setTimeout(() => {
  if (meterNumber) {
    loadEnergyDataForMeter(meterNumber);
  }
}, 2000); // Wait 2 seconds for ESP32 to apply token
```

### ESP32 Display (`src/main.cpp`)

**Enhanced display message:**
- Shows "Added: X kWh" and "Total: Y kWh" when adding to existing energy
- Shows "kWh: X" when starting fresh

## Example Scenarios

### Scenario 1: Purchase While Energy Still Valid

**Initial State:**
- Purchase 1: 50 kWh
- ESP32 remaining: 50 kWh
- Dashboard: Remaining = 50 kWh, Consumed = 0 kWh

**User purchases 80 kWh more:**
1. Purchase 2 created: 80 kWh
2. ESP32 receives pending token
3. ESP32 adds: 50 + 80 = 130 kWh remaining
4. Dashboard refreshes after 2 seconds
5. Dashboard: Remaining = 130 kWh, Consumed = 0 kWh ✅

**After consuming 20 kWh:**
- ESP32 remaining: 110 kWh
- Dashboard: Remaining = 110 kWh, Consumed = 20 kWh ✅

### Scenario 2: Multiple Purchases

**Purchase 1:** 50 kWh
- ESP32: 50 kWh remaining
- Dashboard: Remaining = 50, Consumed = 0

**Purchase 2:** 80 kWh (while 30 kWh still remaining)
- ESP32 adds: 30 + 80 = 110 kWh remaining
- Dashboard: Remaining = 110, Consumed = 20 (50 + 80 - 110) ✅

**Purchase 3:** 100 kWh (while 50 kWh still remaining)
- ESP32 adds: 50 + 100 = 150 kWh remaining
- Dashboard: Remaining = 150, Consumed = 80 (50 + 80 + 100 - 150) ✅

## Data Flow

```
User Makes Purchase
    ↓
Backend Creates Purchase (with token)
    ↓
ESP32 Checks for Pending Token (every 10 seconds)
    ↓
ESP32 Applies Token (adds to existing if running)
    ↓
ESP32 Sends Updated Energy Data to API
    ↓
Dashboard Refreshes Energy Data (after 2 seconds)
    ↓
Dashboard Calculates:
  - Remaining = ESP32 remainingKwh (source of truth)
  - Consumed = Total Purchased - Remaining
```

## Key Points

1. **ESP32 is the source of truth** for remaining energy
2. **ESP32 adds tokens** to existing remaining energy (not replaces)
3. **Dashboard waits** for ESP32 to update before showing new values
4. **Calculation is always correct**: `consumed = totalPurchased - remaining`
5. **No energy is lost**: All purchased energy is accounted for

## Testing

To verify the fix:

1. **Make initial purchase** (e.g., 50 kWh)
   - Check ESP32 shows 50 kWh remaining
   - Check dashboard shows 50 kWh remaining, 0 consumed

2. **Make second purchase** while energy still valid (e.g., 80 kWh)
   - Wait 2-10 seconds for ESP32 to apply token
   - Check ESP32 shows 130 kWh remaining (50 + 80)
   - Check dashboard shows 130 kWh remaining, 0 consumed

3. **Wait for consumption** (e.g., 20 kWh used)
   - Check ESP32 shows 110 kWh remaining
   - Check dashboard shows 110 kWh remaining, 20 consumed

4. **Verify calculation**:
   - Total Purchased = 130 kWh
   - Remaining = 110 kWh
   - Consumed = 130 - 110 = 20 kWh ✅
