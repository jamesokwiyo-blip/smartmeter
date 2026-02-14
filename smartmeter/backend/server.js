/**
 * Smart Energy Meter API Server
 * Node.js/Express backend for receiving energy meter data
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data storage (in production, use a database)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Helper function to get current timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

// Helper function to save data to file
const saveDataToFile = (data) => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `energy_data_${timestamp}.json`;
  const filepath = path.join(dataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  return filepath;
};

/**
 * POST /api/energy-data
 * Receives energy meter data from ESP32
 * 
 * Request Body:
 * {
 *   "meterNumber": "0215002079873",
 *   "token": "18886583547834136861",
 *   "clientName": "YUMVUHORE",
 *   "clientTIN": "",
 *   "clientPhone": "0782946444",
 *   "remainingKwh": 4.5,
 *   "sessionDuration": 120,
 *   "voltage": 230.5,
 *   "current": 5.2,
 *   "power": 1200.0,
 *   "totalEnergy": 150.5,
 *   "frequency": 50.0,
 *   "powerFactor": 0.95,
 *   "timestamp": 1234567890
 * }
 */
app.post('/api/energy-data', (req, res) => {
  try {
    const data = req.body;
    
    // Validation
    if (!data.meterNumber || !data.token) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: meterNumber and token are required'
      });
    }

    // Validate meter number format (13 digits)
    if (!/^\d{13}$/.test(data.meterNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid meter number format. Must be 13 digits'
      });
    }

    // Validate token format (20 digits)
    if (!/^\d{20}$/.test(data.token)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token format. Must be 20 digits'
      });
    }

    // Add server timestamp
    const enrichedData = {
      ...data,
      serverTimestamp: getTimestamp(),
      receivedAt: Date.now()
    };

    // Save to file
    const filepath = saveDataToFile(enrichedData);
    console.log(`Data saved to: ${filepath}`);

    // Log the received data
    console.log('Received energy data:', JSON.stringify(enrichedData, null, 2));

    // Response
    res.status(200).json({
      success: true,
      message: 'Energy data received successfully',
      data: {
        meterNumber: data.meterNumber,
        token: data.token,
        remainingKwh: data.remainingKwh,
        receivedAt: enrichedData.serverTimestamp
      }
    });

  } catch (error) {
    console.error('Error processing energy data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/energy-data
 * Retrieve energy data (with optional filters)
 * Query params: meterNumber, token, limit, offset
 */
app.get('/api/energy-data', (req, res) => {
  try {
    const { meterNumber, token, limit = 10, offset = 0 } = req.query;
    
    // Read all data files
    const files = fs.readdirSync(dataDir)
      .filter(file => file.startsWith('energy_data_') && file.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first

    let data = [];
    
    for (const file of files) {
      const filepath = path.join(dataDir, file);
      const fileData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      
      // Apply filters
      if (meterNumber && fileData.meterNumber !== meterNumber) continue;
      if (token && fileData.token !== token) continue;
      
      data.push(fileData);
    }

    // Apply pagination
    const paginatedData = data.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.status(200).json({
      success: true,
      count: paginatedData.length,
      total: data.length,
      data: paginatedData
    });

  } catch (error) {
    console.error('Error retrieving energy data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/energy-data/:meterNumber
 * Get latest energy data for a specific meter
 */
app.get('/api/energy-data/:meterNumber', (req, res) => {
  try {
    const { meterNumber } = req.params;
    
    const files = fs.readdirSync(dataDir)
      .filter(file => file.startsWith('energy_data_') && file.endsWith('.json'))
      .sort()
      .reverse();

    for (const file of files) {
      const filepath = path.join(dataDir, file);
      const fileData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      
      if (fileData.meterNumber === meterNumber) {
        return res.status(200).json({
          success: true,
          data: fileData
        });
      }
    }

    res.status(404).json({
      success: false,
      error: 'No data found for the specified meter number'
    });

  } catch (error) {
    console.error('Error retrieving meter data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: getTimestamp(),
    uptime: process.uptime()
  });
});

/**
 * GET /
 * API information
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Energy Meter API',
    version: '1.0.0',
    endpoints: {
      'POST /api/energy-data': 'Receive energy meter data',
      'GET /api/energy-data': 'Retrieve energy data with filters',
      'GET /api/energy-data/:meterNumber': 'Get latest data for a meter',
      'GET /api/health': 'Health check'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Smart Energy Meter API Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
