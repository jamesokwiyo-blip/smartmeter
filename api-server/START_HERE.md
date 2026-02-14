# 🚀 START HERE - Quick Commands

## Problem Solved! ✅

You were getting "pio not recognized" because PlatformIO wasn't in your PATH.

## Quick Solution

### Option 1: Use the Helper Script (Easiest)
```powershell
cd api-server
.\build.ps1          # Build the project
.\build.ps1 upload  # Build and upload to ESP32
.\build.ps1 monitor  # Monitor serial output
```

### Option 2: Add PATH Manually (One-time per session)
```powershell
cd api-server
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
pio run
```

### Option 3: Make PATH Permanent
Add this to your PowerShell profile (`notepad $PROFILE`):
```powershell
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
```

Then restart PowerShell and you can use `pio` directly.

## Common Commands

```powershell
# Always start in api-server directory
cd api-server

# Build project
.\build.ps1
# or
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"; pio run

# Upload to ESP32
.\build.ps1 upload
# or
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"; pio run -t upload

# Monitor serial
.\build.ps1 monitor
# or
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"; pio device monitor
```

## What Just Happened?

When you ran `pio run`, PlatformIO:
1. ✅ Found your `platformio.ini` file
2. ✅ Started downloading required libraries
3. ⚠️ Had a network timeout on one library (will retry)

The build process is working! If you see network errors, just run the command again - it will retry.
