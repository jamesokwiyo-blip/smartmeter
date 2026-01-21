# Smart Energy Meter API Server

Backend API server for receiving and managing energy meter data from ESP32 devices.

## Installation

1. Install Node.js (v14 or higher)

2. Install dependencies:
```bash
npm install
```

## Configuration

The server runs on port 3000 by default. To change the port, set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

- `POST /api/energy-data` - Receive energy meter data
- `GET /api/energy-data` - Retrieve energy data with filters
- `GET /api/energy-data/:meterNumber` - Get latest data for a meter
- `GET /api/health` - Health check

See `API_DOCUMENTATION.md` for detailed API documentation.

## Data Storage

Currently, data is stored in JSON files in the `data/` directory. Each file is named with a timestamp.

**Note**: For production, implement a proper database (MongoDB, PostgreSQL, etc.)

## Testing

See `TESTING.md` for testing instructions using Postman and curl.

## Project Structure

```
api-server/
├── server.js          # Main server file
├── package.json       # Dependencies
├── data/             # Data storage directory (created automatically)
└── README.md         # This file
```

## Dependencies

- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing

## License

ISC
