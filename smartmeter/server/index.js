import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import purchasesRoutes from './routes/purchases.js';
import energyDataRoutes from './routes/energyData.js';
import { initializeDatabase } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://localhost:3000',
  'http://192.168.1.120:8080',
  'http://192.168.1.120:8081',
  'http://192.168.1.120:8082',
  'https://smartmeter-jdw0.onrender.com',
  'https://smartmeter-coral.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (ESP32, curl, Postman) and same-origin
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://192.168.') ||   // any local network device
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app');

    if (isAllowed) {
      return callback(null, true);
    }
    console.log('Blocked origin:', origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
};

app.use(cors(corsOptions));
// Explicitly handle preflight across all routes
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api', energyDataRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 Network access: http://192.168.1.120:${PORT}`);
    console.log(`📊 Database: MongoDB Atlas`);
    console.log(`🔌 ESP32 endpoint: http://192.168.1.120:${PORT}/api/energy-data`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
