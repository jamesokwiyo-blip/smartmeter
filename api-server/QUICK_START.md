# Quick Start Guide - API Server

## ⚠️ IMPORTANT: Directory Requirement

**You MUST run PlatformIO commands from the `api-server/` directory!**

The `platformio.ini` file is located in `api-server/`, so all `pio` commands must be executed from this folder.

### ❌ Wrong (will cause error):
```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER"
pio run  # Error: Not a PlatformIO project
```

### ✅ Correct:
```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER\api-server"
pio run  # Works!
```

## PlatformIO Command Fix

PlatformIO is installed but not in your PATH. Here are quick solutions:

### Solution 1: Add to PATH for Current Session
```powershell
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
cd api-server
pio run
```

### Solution 2: Use Full Path
```powershell
cd api-server
& "$env:USERPROFILE\.platformio\penv\Scripts\pio.exe" run
```

### Solution 3: Use Helper Script
```powershell
cd api-server
.\pio.ps1 run
```

### Solution 4: Make Permanent (Recommended)
Add to your PowerShell profile:
```powershell
# Open profile
notepad $PROFILE

# Add this line:
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
```

Then restart PowerShell.

## Common Commands

```powershell
# Navigate to api-server
cd api-server

# Build project
pio run

# Upload to ESP32
pio run -t upload

# Monitor serial
pio device monitor

# Clean build
pio run -t clean
```

## Running the API Server

The API server (Node.js) is separate from PlatformIO:

```powershell
cd api-server
npm install
npm start
# Server runs on http://localhost:3000
```
