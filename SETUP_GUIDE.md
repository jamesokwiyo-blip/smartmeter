# Setup Guide - Smart Energy Meter System

## Quick Start

### 1. ESP32 Configuration

Edit `include/config.h` (and any overrides in `src/main.cpp` if used) and set:

- **WIFI_SSID**, **WIFI_PASSWORD** – your WiFi credentials
- **API_BASE_URL** – use your PC’s LAN IP and port **5000** if using the smartmeter backend, e.g. `http://192.168.1.120:5000/api`
- **METER_NUMBER** (13 digits), **CLIENT_NAME**, **CLIENT_PHONE** – meter and client details

### 2. Build, Upload and Debug

**In VS Code (PlatformIO IDE):**
- **Build**: `Ctrl+Alt+B` or click the ✓ (check) button in the PlatformIO toolbar
- **Upload**: `Ctrl+Alt+U` or click the →→ (upload) button in the toolbar
- **Serial Monitor (debug)**: Click the plug/serial icon in the toolbar, or run **PlatformIO: Serial Monitor** from the Command Palette

**From command line (project root):**
```bash
pio run              # Build
pio run -t upload    # Upload firmware to ESP32
pio device monitor   # Open serial monitor for debug output
```

On Windows PowerShell (if `pio` is not in PATH):
```powershell
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
pio run -t upload
pio device monitor
```

### 3. Start API Server (Option B – local: ESP32 talks to your PC)

**Step 1 – Get your PC IP**  
PowerShell: `Get-NetIPAddress -AddressFamily IPv4` — note the IPv4 of your WiFi adapter (e.g. `192.168.1.120`), not 127.0.0.1.

**Step 2 – Allow port 5000 in Windows Firewall** (run once; PowerShell as Administrator):
```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER"
.\scripts\allow-port-5000-firewall.ps1
```
If blocked: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`. Or manually: Windows Security → Firewall → Advanced → Inbound rules → New rule → Port → TCP 5000 → Allow.

**Step 3 – Start the server** (keep terminal open):

```bash
cd smartmeter
npm install
npm run dev:server
```

Wait for "Server running on port 5000". **Step 4** – In `include/config.h` set `API_BASE_URL` to your PC IP (Step 1), e.g. `http://192.168.1.120:5000/api`, then build and upload. **Step 5** – Test: `curl http://localhost:5000/api/health` and `curl http://YOUR_PC_IP:5000/api/health`. For ESP32, set `API_BASE_URL` in `include/config.h` to your PC’s 
**Checklist:** Same WiFi + server running + firewall allows 5000 + correct IP in config.h + re-upload.

Optional: **api-server** (port 3000) for a minimal receiver only:
```bash
cd api-server
npm install
npm start
```

### 4. Test API

```bash
# Health check (smartmeter backend on 5000)
curl http://localhost:5000/api/health

# Send test data
curl -X POST http://localhost:5000/api/energy-data \
  -H "Content-Type: application/json" \
  -d '{
    "meterNumber": "0215002079873",
    "token": "18886583547834136861",
    "clientName": "YUMVUHORE",
    "clientPhone": "0782946444",
    "remainingKwh": 4.523,
    "sessionDuration": 120
  }'
```

## Important Notes

1. **WiFi and HTTPClient**: These are built-in ESP32 libraries, no additional installation needed
2. **API Server IP**: Use your computer's local IP address (not localhost) when configuring ESP32
3. **Token Format**: Tokens are stored without spaces but displayed with spaces for readability
4. **Meter Number**: Must be exactly 13 digits
5. **Token**: Must be exactly 20 digits

## Troubleshooting

- **WiFi not connecting**: Check SSID and password, ensure 2.4GHz network
- **API not receiving data**: Verify server IP address and firewall settings
- **Token not accepted**: Check token exists in `tokens[]` array in `main.cpp`
- **`EADDRINUSE: address already in use 0.0.0.0:5000`**: Another process is using port 5000. Stop it first:
  - Close any other terminal where `npm run dev:server` or `npm run dev:both` is running, or
  - On Windows, find and kill the process: `Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }`
  - Then run `npm run dev:server` again.
- **WiFi config AP not visible** (SmartMeter AP not on phone/serial):
  - Open Serial Monitor at **115200** baud. You should see `[SmartMeter] Setup started` then `[SmartMeter] Starting WiFi...` and `WiFiManager AP name: SmartMeterWiFi`. If you see nothing, check USB/cable and that the correct port is selected.
  - If you see those messages but no AP on the phone: in `include/config.h` set **`FORCE_WIFI_CONFIG_PORTAL`** to **`1`**, upload, power the meter once (AP should appear), configure WiFi, then set it back to **`0`** and re-upload so it doesn’t clear WiFi every boot.
  - AP name is set by `WIFI_AP_NAME` in `config.h`; use only letters/numbers (e.g. `SmartMeterWiFi`) if some devices don’t show it.
