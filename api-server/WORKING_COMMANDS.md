# Working PlatformIO Commands

## ✅ Correct Usage

Always navigate to `api-server/` directory first:

```powershell
# Step 1: Navigate to api-server
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER\api-server"

# Step 2: Add PlatformIO to PATH (if not already added)
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"

# Step 3: Now you can run PlatformIO commands
pio run              # Build the project
pio run -t upload    # Upload to ESP32
pio device monitor   # Monitor serial output
pio run -t clean     # Clean build files
```

## ❌ Common Mistakes

### Mistake 1: Running from parent directory
```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER"
pio run
# Error: Not a PlatformIO project. `platformio.ini` file has not been found
```

**Solution**: Always `cd api-server` first!

### Mistake 2: PlatformIO not in PATH
```powershell
cd api-server
pio run
# Error: pio : The term 'pio' is not recognized
```

**Solution**: Add PlatformIO to PATH:
```powershell
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
```

## Quick Reference Script

Create a file `build.ps1` in `api-server/`:

```powershell
# build.ps1
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
pio run
```

Then run:
```powershell
cd api-server
.\build.ps1
```

## One-Liner for Quick Access

```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER\api-server"; $env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"; pio run
```
