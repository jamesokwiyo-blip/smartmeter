# Project Structure

## Overview

This project is organized into two main components:

1. **api-server/** - ESP32 firmware and API server for receiving energy meter data
2. **smartmeter/** - Frontend web application and backend server

## Directory Structure

```
SMART ENERGY METER/
├── api-server/                    # ESP32 Project + API Server
│   ├── src/
│   │   └── main.cpp              # ESP32 firmware code
│   ├── include/                   # PlatformIO include files
│   ├── lib/                       # PlatformIO library files
│   ├── test/                     # PlatformIO test files
│   ├── platformio.ini            # PlatformIO configuration
│   ├── server.js                 # Node.js API server (receives ESP32 data)
│   ├── package.json              # Node.js dependencies for API server
│   ├── test-api.sh               # API testing script
│   └── README.md                 # API server documentation
│
├── smartmeter/                    # Web Application (Frontend + Backend)
│   ├── src/                       # React/TypeScript frontend source
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── lib/                  # Utility libraries
│   │   └── ...
│   ├── server/                    # Backend server (MongoDB + Express)
│   │   ├── index.js              # Main server file
│   │   ├── database.js           # MongoDB connection
│   │   ├── models/               # Mongoose models (User, Meter, Purchase)
│   │   ├── routes/               # API routes (auth, purchases)
│   │   └── scripts/              # Migration scripts
│   ├── backend/                  # Alternative backend (duplicate - can be removed)
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend + Backend dependencies
│   └── ...
│
├── API_DOCUMENTATION.md          # API documentation
├── TESTING.md                    # Testing guide
├── SETUP_GUIDE.md                # Setup instructions
├── Smart_Energy_Meter_API.postman_collection.json  # Postman collection
└── README.md                     # Main project README
```

## Component Details

### api-server/
**Purpose**: ESP32 firmware and API endpoint for receiving real-time energy meter data

**Contents**:
- **ESP32 Firmware** (`src/main.cpp`): 
  - Handles PZEM-004T energy monitoring
  - Nokia 5110 LCD display
  - Keypad input for tokens
  - WiFi connectivity
  - Sends data to API server

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

## Integration Points

### Current State
- **api-server/server.js**: Standalone API server receiving ESP32 data
- **smartmeter/server/**: Web application backend with MongoDB

### Future Integration
The `api-server/server.js` should be integrated with `smartmeter/server/` to:
- Store energy data in MongoDB instead of JSON files
- Link energy readings with purchases
- Provide unified API endpoints

## Running the Project

### ESP32 Firmware
```bash
cd api-server
pio run -t upload
```

### API Server (ESP32 Data Receiver)
```bash
cd api-server
npm install
npm start
# Runs on http://localhost:3000
```

### Web Application Backend
```bash
cd smartmeter
npm install
npm run dev:server
# Runs on http://localhost:5000
```

### Web Application Frontend
```bash
cd smartmeter
npm install
npm run dev
# Runs on http://localhost:5173
```

### Run Both Frontend + Backend
```bash
cd smartmeter
npm run dev:both
```

## Notes

- The `smartmeter/backend/` folder appears to be a duplicate and can be removed
- ESP32 firmware sends to `api-server/server.js` on port 3000
- Web app backend runs on `smartmeter/server/` on port 5000
- Consider merging `api-server/server.js` into `smartmeter/server/` for unified backend
