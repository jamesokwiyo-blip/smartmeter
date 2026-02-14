# Project Structure

## Overview

This project is organized with PlatformIO files at the root (for VS Code IDE compatibility) and separate folders for the API server and web application.

## Directory Structure

```
SMART ENERGY METER/                    # Root - PlatformIO Project
├── src/
│   └── main.cpp                      # ESP32 firmware source code
├── platformio.ini                     # PlatformIO configuration (ROOT - for VS Code IDE)
├── include/                           # PlatformIO include files
├── lib/                               # PlatformIO library files
├── test/                              # PlatformIO test files
│
├── api-server/                        # Node.js API Server (receives ESP32 data)
│   ├── server.js                      # API server for receiving energy meter data
│   ├── package.json                   # Node.js dependencies
│   ├── test-api.sh                    # API testing script
│   └── README.md                      # API server documentation
│
├── smartmeter/                        # Web Application (Frontend + Backend)
│   ├── src/                           # React/TypeScript frontend source
│   ├── server/                        # Backend server (MongoDB + Express)
│   │   ├── index.js                   # Main server file
│   │   ├── database.js                # MongoDB connection
│   │   ├── models/                   # Mongoose models
│   │   └── routes/                   # API routes
│   └── package.json                  # Frontend + Backend dependencies
│
└── Documentation files
    ├── API_DOCUMENTATION.md
    ├── TESTING.md
    ├── SETUP_GUIDE.md
    └── ...
```

## Component Details

### Root Directory (PlatformIO Project)
**Purpose**: ESP32 firmware development - VS Code PlatformIO IDE expects files here

**Contents**:
- **ESP32 Firmware** (`src/main.cpp`): 
  - Handles PZEM-004T energy monitoring
  - Nokia 5110 LCD display
  - Keypad input for tokens
  - WiFi connectivity
  - Sends data to API server

- **PlatformIO Config** (`platformio.ini`):
  - Board: ESP32 Dev Module
  - Framework: Arduino
  - Libraries: PZEM-004T, Adafruit GFX, Nokia 5110 LCD, etc.

**Why at root?**: VS Code PlatformIO IDE extension automatically detects `platformio.ini` at the workspace root and provides build/upload buttons in the IDE.

### api-server/
**Purpose**: Node.js API endpoint for receiving real-time energy meter data from ESP32

**Contents**:
- **API Server** (`server.js`):
  - Receives energy data from ESP32 devices
  - Validates meter numbers (13 digits) and tokens (20 digits)
  - Stores data in JSON files (can be migrated to database)
  - Endpoints:
    - `POST /api/energy-data` - Receive energy meter data
    - `GET /api/energy-data` - Retrieve energy data
    - `GET /api/energy-data/:meterNumber` - Get meter data
    - `GET /api/health` - Health check

**Port**: 3000 (default)

### smartmeter/
**Purpose**: Full-stack web application for smart meter management

**Contents**:
- **Frontend** (`src/`):
  - React + TypeScript
  - Vite build system
  - shadcn-ui components
  - TanStack Query for data fetching
  - React Router for navigation

- **Backend** (`server/`):
  - Express.js server
  - MongoDB Atlas database
  - JWT authentication
  - Mongoose ODM
  - Routes:
    - `/api/auth` - Authentication
    - `/api/purchases` - Purchase management
  - Models:
    - User - User accounts
    - Meter - Meter registrations
    - Purchase - Electricity purchases

**Port**: 5000 (default for backend), 5173 (default for frontend)

## Data Flow

1. **ESP32 Device** → Sends energy data → **api-server/server.js** (Port 3000)
2. **Web Frontend** → User interactions → **smartmeter/server/** (Port 5000)
3. **smartmeter/server/** → Stores purchases → **MongoDB Atlas**

## Running the Project

### ESP32 Firmware (VS Code PlatformIO IDE)
1. Open the project root in VS Code
2. Install PlatformIO IDE extension
3. Use the PlatformIO toolbar buttons:
   - Build: `Ctrl+Alt+B` or click ✓
   - Upload: `Ctrl+Alt+U` or click →→
   - Monitor: Click Serial Monitor icon

**Or use command line:**
```powershell
# From root directory
$env:PATH += ";$env:USERPROFILE\.platformio\penv\Scripts"
pio run              # Build
pio run -t upload    # Upload
pio device monitor   # Monitor
```

### API Server (ESP32 Data Receiver)
```powershell
cd api-server
npm install
npm start
# Runs on http://localhost:3000
```

### Web Application Backend
```powershell
cd smartmeter
npm install
npm run dev:server
# Runs on http://localhost:5000
```

### Web Application Frontend
```powershell
cd smartmeter
npm install
npm run dev
# Runs on http://localhost:5173
```

### Run Both Frontend + Backend
```powershell
cd smartmeter
npm run dev:both
```

## VS Code PlatformIO IDE Integration

The PlatformIO files are at the root so VS Code PlatformIO IDE extension can:
- ✅ Automatically detect the project
- ✅ Show build/upload buttons in the toolbar
- ✅ Provide IntelliSense for ESP32 development
- ✅ Show serial monitor integration
- ✅ Display project status in the status bar

## Notes

- PlatformIO project files (`platformio.ini`, `src/`, `include/`, `lib/`, `test/`) are at root for VS Code IDE compatibility
- API server (`api-server/`) is separate and can run independently
- Web app (`smartmeter/`) is a complete full-stack application
- Consider integrating `api-server/server.js` into `smartmeter/server/` for unified backend
