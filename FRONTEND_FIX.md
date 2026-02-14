# Frontend Server - Port Configuration

## Issue Found

The frontend is configured to run on **port 8080**, not 5173.

Looking at `vite.config.ts`:
```typescript
server: {
  host: "::",
  port: 8080,
}
```

## Current Status

The frontend server started on **port 8082** because:
- Port 8080 was in use
- Port 8081 was in use
- Vite automatically found the next available port: **8082**

## Access the Frontend

Open your browser and go to:
```
http://localhost:8082
```

## To Use Port 5173 (Standard Vite Port)

If you want to use port 5173, update `vite.config.ts`:

```typescript
server: {
  host: "::",
  port: 5173,  // Change from 8080 to 5173
}
```

Or remove the port configuration to use Vite's default (5173):
```typescript
server: {
  host: "::",
  // port: 8080,  // Remove this line
}
```

## Start Frontend Server

Run in PowerShell:
```powershell
cd smartmeter
npm run dev
```

The server will show:
```
➜  Local:   http://localhost:XXXX/
```

Use the port shown in the output.

## Quick Fix

The frontend should now be accessible at:
- **http://localhost:8082** (current running instance)

Or restart and it will find the next available port.
