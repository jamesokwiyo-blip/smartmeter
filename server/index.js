import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import purchasesRoutes from './routes/purchases.js';
import { initializeDatabase } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:8080', 
    'http://localhost:3000',
    'https://smartmeter-jdw0.onrender.com',
    /\.vercel\.app$/,
    /\.netlify\.app$/
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchasesRoutes);

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
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: MongoDB Atlas`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
