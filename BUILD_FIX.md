# Build Error Fix - ModuleNotFoundError: No module named 'intelhex'

## Problem
PlatformIO build fails with:
```
ModuleNotFoundError: No module named 'intelhex'
*** [.pio\build\esp32dev\bootloader.bin] Error 1
```

## Solutions

### Solution 1: Reinstall ESP32 Platform (Recommended)
This will reinstall all PlatformIO tools and dependencies:

```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER"
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"

# Reinstall ESP32 platform (this will fix missing dependencies)
pio platform install espressif32
```

Then rebuild:
```powershell
pio run -t clean
pio run
```

### Solution 2: Install intelhex using PlatformIO's Python
PlatformIO has its own Python environment:

```powershell
# Use PlatformIO's Python
& "$env:USERPROFILE\.platformio\penv\Scripts\python.exe" -m pip install intelhex
```

### Solution 3: Install Python and intelhex
If Python is not installed:

1. **Install Python**:
   - Download from: https://www.python.org/downloads/
   - Or install from Microsoft Store
   - Make sure to check "Add Python to PATH" during installation

2. **Install intelhex**:
   ```powershell
   python -m pip install intelhex
   ```

### Solution 4: Update PlatformIO Core
Sometimes updating PlatformIO fixes dependency issues:

```powershell
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
pip install --upgrade platformio
```

## Quick Fix (Try This First)

```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER"
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"

# Clean build
pio run -t clean

# Reinstall platform (fixes dependencies)
pio platform install espressif32

# Rebuild
pio run
```

## After Fixing

Once the dependency is installed, you can build normally:
- **VS Code**: Click the PlatformIO build button (✓)
- **Terminal**: `pio run`
- **Upload**: `pio run -t upload`

## Why This Happens

The `intelhex` module is required by `esptoolpy` (ESP32 flashing tool) but sometimes doesn't get installed automatically. Reinstalling the ESP32 platform ensures all dependencies are properly installed.
