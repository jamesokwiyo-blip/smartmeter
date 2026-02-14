import mongoose from 'mongoose';
import User from './models/User.js';
import Meter from './models/Meter.js';
import Purchase from './models/Purchase.js';
import EnergyData from './models/EnergyData.js';

const { ObjectId } = mongoose.Types;

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

  async saveResetToken(userId, resetToken) {
    try {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1); // Token valid for 1 hour
      await User.findByIdAndUpdate(userId, {
        resetToken,
        resetTokenExpiry: expiry
      });
    } catch (error) {
      throw error;
    }
  },

  async updatePassword(userId, passwordHash) {
    try {
      await User.findByIdAndUpdate(userId, {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      });
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
      // Ensure userId is a valid ObjectId
      const userIdObj = typeof userId === 'string' ? new ObjectId(userId) : userId;
      return await Meter.find({ userId: userIdObj }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error in getMetersByUserId:', error);
      throw error;
    }
  },

  // Purchases
  async createPurchase(userId, meterNumber, amountRWF, kwhAmount, paymentMethod, mobileNumber, tokenNumber, rechargeCode) {
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
        status: 'COMPLETED',
        date: new Date().toISOString().split('T')[0]
      });
      return purchase;
    } catch (error) {
      throw error;
    }
  },

  async getPurchasesByUserId(userId) {
    try {
      // Ensure userId is a valid ObjectId
      const userIdObj = typeof userId === 'string' ? new ObjectId(userId) : userId;
      return await Purchase.find({ userId: userIdObj }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error in getPurchasesByUserId:', error);
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

  async getPendingTokenForMeter(meterNumber) {
    try {
      // Get the most recent purchase for this meter that hasn't been applied yet
      return await Purchase.findOne({ 
        meterNumber,
        tokenApplied: false 
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error in getPendingTokenForMeter:', error);
      throw error;
    }
  },

  async confirmTokenApplied(purchaseId) {
    try {
      const purchaseIdObj = typeof purchaseId === 'string' ? new ObjectId(purchaseId) : purchaseId;
      return await Purchase.findByIdAndUpdate(
        purchaseIdObj,
        { 
          tokenApplied: true,
          tokenAppliedAt: new Date()
        },
        { new: true }
      );
    } catch (error) {
      console.error('Error in confirmTokenApplied:', error);
      throw error;
    }
  },

  // Energy data (from ESP32)
  async createEnergyData(data) {
    try {
      const doc = await EnergyData.create(data);
      return doc;
    } catch (error) {
      throw error;
    }
  },

  async getEnergyDataList({ meterNumber, token, limit = 10, offset = 0 }) {
    try {
      const filter = {};
      if (meterNumber) filter.meterNumber = meterNumber;
      if (token) filter.token = token;
      const total = await EnergyData.countDocuments(filter);
      const data = await EnergyData.find(filter)
        .sort({ createdAt: -1 })
        .skip(parseInt(offset, 10))
        .limit(parseInt(limit, 10))
        .lean();
      return { data, total };
    } catch (error) {
      throw error;
    }
  },

  async getLatestEnergyDataByMeter(meterNumber) {
    try {
      return await EnergyData.findOne({ meterNumber })
        .sort({ createdAt: -1 })
        .lean();
    } catch (error) {
      throw error;
    }
  },

  async getEnergyDataListForMeters(meterNumbers, limit = 10, offset = 0) {
    try {
      if (!meterNumbers || meterNumbers.length === 0) {
        return { data: [], total: 0 };
      }
      const filter = { meterNumber: { $in: meterNumbers } };
      const total = await EnergyData.countDocuments(filter);
      const data = await EnergyData.find(filter)
        .sort({ createdAt: -1 })
        .skip(parseInt(offset, 10))
        .limit(parseInt(limit, 10))
        .lean();
      return { data, total };
    } catch (error) {
      throw error;
    }
  }
};

export default db;
