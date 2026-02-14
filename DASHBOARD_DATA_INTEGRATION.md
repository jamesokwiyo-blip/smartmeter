# Dashboard Data Integration - Real Database Data

## Overview
The dashboard now displays **real data** from the database instead of hardcoded values. All metrics are calculated from actual purchase history and ESP32 meter readings.

## Data Flow

### 1. **Remaining Energy (kWh)**
- **Source**: ESP32 meter (`remainingKwh` field)
- **API**: `GET /api/energy-data/:meterNumber`
- **Update Frequency**: Every 10 seconds (auto-refresh)
- **Display**: Shows current remaining kWh balance on the meter

### 2. **Energy Consumed (kWh)**
- **Calculation**: `Total kWh Purchased - Remaining kWh`
- **Formula**: `Math.max(0, totalKwhPurchased - remainingKwh)`
- **Source**: 
  - `totalKwhPurchased`: Sum of all purchases from purchase history
  - `remainingKwh`: Latest reading from ESP32
- **Display**: Shows how much energy has been consumed from all purchases

### 3. **Total Spent (RWF)**
- **Source**: Purchase history
- **Calculation**: `purchases.reduce((sum, p) => sum + p.amount, 0)`
- **API**: `GET /api/purchases/history`
- **Display**: Total amount spent across all purchases

### 4. **Total kWh**
- **Source**: Purchase history
- **Calculation**: `purchases.reduce((sum, p) => sum + p.kwh, 0)`
- **API**: `GET /api/purchases/history`
- **Display**: Total kWh purchased across all transactions

### 5. **Transactions Count**
- **Source**: Purchase history array length
- **Calculation**: `purchases.length`
- **Display**: Number of completed purchases

## ESP32 Data Payload

The ESP32 sends the following data to `/api/energy-data`:

```json
{
  "meterNumber": "0215002079873",
  "token": "27242952938634495859",
  "clientName": "YUMVUHORE",
  "clientPhone": "0782946444",
  "remainingKwh": 80.0,
  "sessionDuration": 30,
  "voltage": 230.5,
  "current": 2.5,
  "power": 575.0,
  "totalEnergy": 15.5,
  "frequency": 50.0,
  "powerFactor": 0.95,
  "timestamp": 1736845402000,
  "timestampFormatted": "2026-02-14T08:33:22"
}
```

### Key Fields:
- **`remainingKwh`**: Used by dashboard for "Remaining Energy" display
- **`totalEnergy`**: PZEM cumulative reading (for diagnostics, not main display)
- **`voltage`, `current`, `power`**: Used in meter diagnostics section
- **`timestamp`**: Unix timestamp in milliseconds (Number type for database)
- **`timestampFormatted`**: ISO 8601 string for display

## Dashboard Calculations

### Energy Usage Percentage
```javascript
const totalKwhPurchased = purchases.reduce((sum, p) => sum + p.kwh, 0);
const calculatedUsedKwh = Math.max(0, totalKwhPurchased - remainingKwh);
const totalCapacity = totalKwhPurchased || (remainingKwh + calculatedUsedKwh);
const usagePercentage = totalCapacity > 0 
  ? (calculatedUsedKwh / totalCapacity) * 100 
  : 0;
```

### Progress Bar
- **Total Capacity**: `totalKwhPurchased` (or fallback to `remainingKwh + usedKwh`)
- **Consumed**: `calculatedUsedKwh`
- **Percentage**: `(consumed / total) * 100`

## Real-Time Updates

The dashboard automatically refreshes energy data every **10 seconds** to show the latest meter readings:

```javascript
useEffect(() => {
  if (!user || !meterNumber) return;
  loadEnergyDataForMeter(meterNumber);
  
  // Refresh energy data every 10 seconds
  const interval = setInterval(() => {
    loadEnergyDataForMeter(meterNumber);
  }, 10000);
  
  return () => clearInterval(interval);
}, [user, meterNumber]);
```

## Data Matching Verification

### ESP32 → Database → Dashboard Flow:

1. **ESP32 sends data** → `POST /api/energy-data`
   - Validates 13-digit meter number
   - Validates 20-digit token
   - Stores in MongoDB `EnergyData` collection

2. **Dashboard fetches data** → `GET /api/energy-data/:meterNumber`
   - Requires authentication
   - Verifies meter belongs to user
   - Returns latest energy data

3. **Dashboard calculates display values**:
   - Remaining Energy: Direct from ESP32 `remainingKwh`
   - Energy Consumed: `Total kWh Purchased - Remaining kWh`
   - Total Spent: Sum of purchase amounts
   - Total kWh: Sum of purchase kWh values
   - Transactions: Count of purchases

## Testing

To verify the data flow:

1. **Check ESP32 Serial Monitor**:
   - Verify `remainingKwh` value matches meter state
   - Check HTTP response code (200 = success)

2. **Check Backend Logs**:
   - Verify data is received: `Energy data received successfully`
   - Check MongoDB: Data stored in `EnergyData` collection

3. **Check Dashboard**:
   - Remaining Energy should match ESP32 `remainingKwh`
   - Energy Consumed = Total kWh - Remaining kWh
   - Total Spent and Total kWh match purchase history
   - Data refreshes every 10 seconds

## Notes

- **Energy Consumed** is calculated, not sent from ESP32
- **Total Energy** from PZEM (`totalEnergy` field) is used for diagnostics only
- All financial data comes from purchase history, not ESP32
- Dashboard shows real-time meter status with 10-second refresh
