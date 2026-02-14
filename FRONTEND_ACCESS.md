# Frontend Access Guide

## Servers Started

Two servers have been started in separate PowerShell windows:

### 1. Backend Server
- **URL**: `http://localhost:5000`
- **Status**: Running in PowerShell window
- **Purpose**: API endpoints, database connections

### 2. Frontend Server
- **URL**: `http://localhost:5173`
- **Status**: Starting in PowerShell window
- **Purpose**: React web application (dashboard)

## Access the Dashboard

The frontend should automatically open in your browser at:
```
http://localhost:5173
```

If it didn't open automatically, manually navigate to:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/health`

## Login to Dashboard

### Option 1: Create a New Account
1. Go to `http://localhost:5173`
2. Click "Create Account" or "Sign Up"
3. Fill in:
   - Full Name
   - Email
   - Phone Number
   - Password
4. Submit to create account
5. You'll be automatically logged in

### Option 2: Use Existing Account
1. Go to `http://localhost:5173`
2. Click "Login"
3. Enter your email and password
4. Click "Sign In"

## Dashboard Features

Once logged in, you can:
- View your meters
- Purchase electricity tokens
- View purchase history
- See energy consumption data (when ESP32 sends data)
- Manage your profile

## Troubleshooting

### Frontend not loading
- Wait a few seconds for Vite to compile
- Check the PowerShell window for errors
- Ensure port 5173 is not blocked by firewall

### Backend connection errors
- Verify backend is running on port 5000
- Check backend PowerShell window for errors
- Ensure MongoDB connection is working

### Login not working
- Check backend server is running
- Verify MongoDB connection
- Check browser console for errors (F12)

## Server Windows

You should see two PowerShell windows:
1. **Backend**: Shows "✅ Server running on http://localhost:5000"
2. **Frontend**: Shows "Local: http://localhost:5173"

## Stop Servers

Press `Ctrl+C` in each PowerShell window to stop the servers.

## Quick Commands

**Start both servers together:**
```powershell
cd smartmeter
npm run dev:both
```

**Start separately:**
```powershell
# Backend
npm run dev:server

# Frontend (in another terminal)
npm run dev
```
