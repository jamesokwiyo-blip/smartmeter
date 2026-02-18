import mongoose from 'mongoose';
import User from './models/User.js';
import Meter from './models/Meter.js';
import Purchase from './models/Purchase.js';

// MongoDB connection
export async function initializeDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alain:drin12345@cluster0.fb45zjg.mongodb.net/smartmeter?retryWrites=true&w=majority';
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Database operations
const db = {
  // Users
  async createUser(fullName, email, phoneNumber, passwordHash) {
    try {
      const user = await User.create({
        fullName,
        email,
        phoneNumber,
        passwordHash
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw error;
    }
  },

  async getUserById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  },

  // Meters
  async createMeter(userId, meterNumber) {
    try {
      const existing = await Meter.findOne({ meterNumber });
      if (existing) return existing;

      const meter = await Meter.create({
        userId,
        meterNumber
      });
      return meter;
    } catch (error) {
      throw error;
    }
  },

  async getMetersByUserId(userId) {
    try {
      return await Meter.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  // Purchases
  async createPurchase(userId, meterNumber, amountRWF, kwhAmount, paymentMethod, mobileNumber, tokenNumber, rechargeCode, status = 'PENDING') {
    try {
      const purchase = await Purchase.create({
        userId,
        meterNumber,
        amountRWF,
        kwhAmount,
        paymentMethod,
        mobileNumber: mobileNumber || null,
        tokenNumber,
        rechargeCode,
        status,
        date: new Date().toISOString().split('T')[0]
      });
      return purchase;
    } catch (error) {
      throw error;
    }
  },

  async getPurchasesByUserId(userId) {
    try {
      return await Purchase.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  async getPurchasesByMeterNumber(meterNumber) {
    try {
      return await Purchase.find({ meterNumber }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },

  async updatePurchaseStatus(purchaseId, status) {
    try {
      return await Purchase.findByIdAndUpdate(purchaseId, { status }, { new: true });
    } catch (error) {
      throw error;
    }
  }
};

export default db;
