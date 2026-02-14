# PlatformIO Setup Guide

## Issue
The `pio` command is not recognized in PowerShell.

## Solutions

### Option 1: Use PlatformIO IDE (Recommended)
If you have PlatformIO IDE installed (VS Code extension or standalone):

1. **Open PlatformIO IDE**
2. **Open the project**: File → Open Folder → Select `api-server` folder
3. **Build/Upload**: Use the PlatformIO toolbar buttons or:
   - Build: `Ctrl+Alt+B`
   - Upload: `Ctrl+Alt+U`

### Option 2: Install PlatformIO CLI

#### Using Python pip (if Python is installed):
```powershell
pip install platformio
```

#### Using PlatformIO Core Installer:
1. Download from: https://platformio.org/install/cli
2. Run the installer
3. Restart PowerShell/terminal

### Option 3: Add PlatformIO to PATH (if already installed)

If PlatformIO is installed but not in PATH, add it:

```powershell
# Check if PlatformIO Core is installed in user directory
$pioPath = "$env:USERPROFILE\.platformio\penv\Scripts"
if (Test-Path $pioPath) {
    $env:PATH += ";$pioPath"
    Write-Host "PlatformIO added to PATH for this session"
}
```

To make it permanent, add to your PowerShell profile:
```powershell
# Edit profile
notepad $PROFILE

# Add this line:
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
```

### Option 4: Use Full Path

If PlatformIO is installed, you can use the full path:

```powershell
# Windows typical installation path
& "$env:USERPROFILE\.platformio\penv\Scripts\pio.exe" run -t upload
```

## Verify Installation

After installation, verify:
```powershell
pio --version
# or
platformio --version
```

## Quick Commands Reference

Once PlatformIO is accessible:

```powershell
cd api-server

# Build the project
pio run

# Upload to ESP32
pio run -t upload

# Monitor serial output
pio device monitor

# Clean build files
pio run -t clean
```

## Alternative: Use PlatformIO IDE

The easiest way is to use PlatformIO IDE (VS Code extension):
1. Install VS Code
2. Install "PlatformIO IDE" extension
3. Open the `api-server` folder
4. Use the PlatformIO toolbar for all operations
