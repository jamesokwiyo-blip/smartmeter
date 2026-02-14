# How to Start the Server

## Method 1: Using PowerShell (Recommended)

Open a **new PowerShell terminal** and run:

```powershell
cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER\smartmeter"
npm run dev:server
```

This will start the server and you'll see output like:
```
✅ Server running on http://localhost:5000
📊 Database: MongoDB Atlas
```

## Method 2: Using VS Code Terminal

1. Open VS Code
2. Press `` Ctrl+` `` to open terminal
3. Navigate to smartmeter folder:
   ```powershell
   cd smartmeter
   ```
4. Run:
   ```powershell
   npm run dev:server
   ```

## Method 3: Using Command Prompt

1. Open Command Prompt (cmd)
2. Navigate to project:
   ```cmd
   cd "C:\Users\ASCOS CO.LTD\Documents\PlatformIO\Projects\SMART ENERGY METER\smartmeter"
   ```
3. Run:
   ```cmd
   npm run dev:server
   ```

## What You Should See

When the server starts successfully, you'll see:

```
✅ Connected to MongoDB Atlas
✅ Server running on http://localhost:5000
📊 Database: MongoDB Atlas
```

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### "Cannot find module"
- Run `npm install` first:
  ```powershell
  cd smartmeter
  npm install
  npm run dev:server
  ```

### "Port 5000 already in use"
- Another process is using port 5000
- Kill the process or change PORT in `.env` file

### "MongoDB connection error"
- Check your `.env` file has correct `MONGODB_URI`
- Ensure MongoDB Atlas connection string is valid

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Verify Server is Running

Open browser and go to:
- `http://localhost:5000/api/health`

You should see: `{"status":"Server is running"}`
