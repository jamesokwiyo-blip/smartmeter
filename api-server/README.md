# API Server - ESP32 Energy Meter Project

This folder contains both the ESP32 firmware and the Node.js API server for receiving energy meter data.

## Project Structure

```
api-server/
├── src/
│   └── main.cpp              # ESP32 firmware source code
├── platformio.ini            # PlatformIO configuration
├── server.js                 # Node.js API server
├── package.json              # Node.js dependencies
└── ...
```

## Important: Running PlatformIO Commands

**⚠️ You MUST run PlatformIO commands from THIS directory (`api-server/`), not from the parent directory!**

The `platformio.ini` file is located here, so all `pio` commands must be executed from this folder.

### Correct Way:
```powershell
# Navigate to api-server directory first
cd api-server

# Add PlatformIO to PATH (if not already added)
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"

# Now run PlatformIO commands
pio run              # Build the project
pio run -t upload    # Upload to ESP32
pio device monitor   # Monitor serial output
```

### Wrong Way (will cause error):
```powershell
# DON'T do this from parent directory
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER"
pio run  # ❌ Error: Not a PlatformIO project
```

## Setup

### 1. Install PlatformIO (if not already installed)
- Install PlatformIO IDE extension in VS Code, OR
- Install PlatformIO CLI: `pip install platformio`

### 2. Add PlatformIO to PATH (one-time setup)
Add to your PowerShell profile (`notepad $PROFILE`):
```powershell
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
```

### 3. Install Node.js Dependencies
```powershell
cd api-server
npm install
```

## Building and Uploading ESP32 Firmware

```powershell
# Navigate to api-server directory
cd api-server

# Ensure PlatformIO is in PATH
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"

# Build the project
pio run

# Upload to ESP32 (connect ESP32 via USB first)
pio run -t upload

# Monitor serial output
pio device monitor
```

## Running the API Server

The API server receives data from ESP32 devices:

```powershell
cd api-server
npm start
# Server runs on http://localhost:3000
```

### API Endpoints

- `POST /api/energy-data` - Receive energy meter data from ESP32
- `GET /api/energy-data` - Retrieve energy data
- `GET /api/energy-data/:meterNumber` - Get latest data for a meter
- `GET /api/health` - Health check

See `API_DOCUMENTATION.md` in the parent directory for full API documentation.

## Configuration

### ESP32 Firmware Configuration

Edit `src/main.cpp` to configure:
- WiFi credentials (SSID and password)
- API server URL
- Meter number
- Client information

### API Server Configuration

The API server runs on port 3000 by default. To change:
```javascript
const PORT = process.env.PORT || 3000;
```

## Troubleshooting

### "Not a PlatformIO project" Error
- **Cause**: Running `pio` command from wrong directory
- **Solution**: Always run from `api-server/` directory where `platformio.ini` is located

### "pio command not found"
- **Cause**: PlatformIO not in PATH
- **Solution**: Add PlatformIO to PATH (see Setup section above)

### Build Errors
- Check that all libraries in `platformio.ini` are available
- Ensure ESP32 board is properly connected
- Check serial port permissions

## Quick Reference

```powershell
# Always start here
cd api-server

# Add PlatformIO to PATH (if needed)
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"

# Build
pio run

# Upload
pio run -t upload

# Monitor
pio device monitor

# Run API server
npm start
```
