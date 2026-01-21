# Smart Energy Meter System

A comprehensive IoT-based prepaid energy meter system using ESP32, PZEM-004T energy monitor, Nokia 5110 LCD display, and a RESTful API backend.

## Features

- **13-digit Meter Number**: Format `0215002079873`
- **20-digit Token System**: Format `1888 6583 5478 3413 6861` (displayed with spaces)
- **Client Information**: Name, TIN (optional), Phone Number
- **Real-time Energy Monitoring**: Voltage, Current, Power, Frequency, Power Factor
- **WiFi Connectivity**: Sends data to cloud server via HTTP API
- **LCD Display**: Nokia 5110 for user interface
- **Keypad Input**: PCF8574T I2C keypad for token entry

## Hardware Components

- ESP32 Development Board
- PZEM-004T v3.0 Energy Monitor
- Nokia 5110 LCD Display (84x48 pixels)
- PCF8574T I2C Keypad (4x4 matrix)
- LED Indicator

## Project Structure

```
SMART ENERGY METER/
├── src/
│   └── main.cpp              # ESP32 firmware
├── api-server/
│   ├── server.js             # Node.js API server
│   ├── package.json          # Node.js dependencies
│   └── data/                 # Data storage (auto-created)
├── platformio.ini            # PlatformIO configuration
├── API_DOCUMENTATION.md      # Complete API documentation
├── TESTING.md                # Testing guide
├── Smart_Energy_Meter_API.postman_collection.json  # Postman collection
└── README.md                 # This file
```

## Setup Instructions

### 1. ESP32 Firmware Setup

1. Install PlatformIO IDE or PlatformIO CLI
2. Open the project in PlatformIO
3. Update WiFi credentials in `src/main.cpp`:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* apiBaseUrl = "http://your-server.com/api";
   ```
4. Update meter number and client information:
   ```cpp
   const char* METER_NUMBER = "0215002079873";
   const char* CLIENT_NAME = "YUMVUHORE";
   const char* CLIENT_PHONE = "0782946444";
   ```
5. Build and upload to ESP32:
   ```bash
   pio run -t upload
   ```

### 2. API Server Setup

1. Navigate to the API server directory:
   ```bash
   cd api-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The API server will run on `http://localhost:3000`

### 3. Testing

#### Using Postman
1. Import `Smart_Energy_Meter_API.postman_collection.json` into Postman
2. Run the requests to test the API

#### Using cURL
See `TESTING.md` for detailed curl examples.

#### Quick Test
```bash
# Health check
curl http://localhost:3000/api/health

# Send energy data
curl -X POST http://localhost:3000/api/energy-data \
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

## Token Format

- **Display Format**: `1888 6583 5478 3413 6861` (with spaces for readability)
- **API Format**: `18886583547834136861` (20 digits without spaces)
- **Validation**: Must be exactly 20 digits

## Meter Number Format

- **Format**: `0215002079873`
- **Length**: Exactly 13 digits
- **Validation**: Must match `/^\d{13}$/`

## Client Information

- **Client Name**: Required (e.g., "YUMVUHORE")
- **Client TIN**: Optional (Tax Identification Number)
- **Client Phone**: Required (e.g., "0782946444")

## API Documentation

See `API_DOCUMENTATION.md` for complete API documentation including:
- Endpoint descriptions
- Request/response formats
- Error handling
- Field specifications

## Data Flow

1. User enters 20-digit token via keypad
2. ESP32 validates token and starts energy session
3. PZEM-004T continuously measures energy consumption
4. ESP32 sends data to API server every 30 seconds
5. API server stores and processes the data
6. When energy is exhausted, final data is sent and session ends

## Pin Configuration

| Component | ESP32 Pin |
|-----------|-----------|
| PZEM RX   | GPIO 17   |
| PZEM TX   | GPIO 16   |
| LCD CLK   | GPIO 18   |
| LCD DIN   | GPIO 23   |
| LCD DC    | GPIO 26   |
| LCD CE    | GPIO 5    |
| LCD RST   | GPIO 27   |
| I2C SDA   | GPIO 21   |
| I2C SCL   | GPIO 22   |
| LED       | GPIO 2    |

## Keypad Layout

```
[ D ] [ # ] [ 0 ] [ * ]
[ C ] [ 9 ] [ 8 ] [ 7 ]
[ B ] [ 6 ] [ 5 ] [ 4 ]
[ A ] [ 3 ] [ 2 ] [ 1 ]
```

- **0-9**: Number input
- **A**: Clear/Reset
- **D**: Submit token
- **\***: Backspace
- **B, C**: Not used

## State Machine

- **STATE_READY**: Waiting for token input
- **STATE_ENTERING**: User entering token
- **STATE_RUNNING**: Active energy consumption
- **STATE_EXHAUSTED**: Energy depleted
- **STATE_BADTOKEN**: Invalid token entered
- **STATE_WIFI_CONNECTING**: Connecting to WiFi

## Troubleshooting

### WiFi Connection Issues
- Check SSID and password in `main.cpp`
- Ensure WiFi signal strength is adequate
- Check serial monitor for connection status

### API Connection Issues
- Verify API server is running
- Check `apiBaseUrl` in `main.cpp`
- Ensure firewall allows connections
- Check serial monitor for HTTP response codes

### Token Not Accepted
- Verify token is exactly 20 digits
- Check token exists in `tokens[]` array
- Ensure token is entered without spaces (spaces are added automatically)

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Authentication/API keys
- Real-time dashboard
- Mobile app integration
- Token generation system
- Usage analytics and reporting

## License

ISC

## Support

For issues or questions, please contact the development team.
