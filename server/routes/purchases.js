import express from 'express';
import db from '../database.js';
import { verifyToken } from './auth.js';
import crypto from 'crypto';

const router = express.Router();

// Generate 20-digit numeric token only (matches ESP32 format, e.g. 18886583547834136861)
function generateTokenAndCode() {
  const digits = '0123456789';
  let token20 = '';
  const bytes = crypto.randomBytes(20);
  for (let i = 0; i < 20; i++) {
    token20 += digits[bytes[i] % 10];
  }
  return {
    tokenNumber: token20,
    rechargeCode: `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  };
}

// Buy electricity
router.post('/buy', verifyToken, async (req, res) => {
  try {
    const { meterNumber, amountRWF, paymentMethod, mobileNumber } = req.body;
    const userId = req.userId;

    if (!meterNumber || !amountRWF || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Meter number must be 13 digits (matches ESP32 METER_NUMBER format)
    const meterStr = String(meterNumber).replace(/\s+/g, '').replace(/[^\d]/g, '');
    if (!/^\d{13}$/.test(meterStr)) {
      return res.status(400).json({ error: 'Meter number must be exactly 13 digits' });
    }

    // Calculate kWh (1 kWh = 125 RWF)
    const kwhAmount = parseFloat((amountRWF / 125).toFixed(2));

    // Generate token and code
    const { tokenNumber, rechargeCode } = generateTokenAndCode();

    // Create meter if needed (use normalized 13-digit string)
    await db.createMeter(userId, meterStr);

    // Create purchase
    const purchase = await db.createPurchase(
      userId,
      meterStr,
      amountRWF,
      kwhAmount,
      paymentMethod,
      mobileNumber || null,
      tokenNumber,
      rechargeCode
    );

    res.json({
      success: true,
      purchase: {
        id: purchase._id,
        meterNumber: purchase.meterNumber,
        amountRWF: purchase.amountRWF,
        kwhAmount: purchase.kwhAmount,
        paymentMethod: purchase.paymentMethod,
        tokenNumber: purchase.tokenNumber,
        rechargeCode: purchase.rechargeCode,
        date: new Date(purchase.date).toLocaleDateString(),
        status: purchase.status
      }
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

// Get purchase history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Getting purchase history for userId:', userId);
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const purchases = await db.getPurchasesByUserId(userId);
    console.log(`Found ${purchases.length} purchases for user ${userId}`);

    res.json({
      success: true,
      purchases: purchases.map(p => ({
        id: p._id,
        date: new Date(p.date).toLocaleDateString(),
        meterNumber: p.meterNumber,
        amount: Number(p.amountRWF) || 0,  // Ensure numeric value
        kwh: Number(p.kwhAmount) || 0,      // Ensure numeric value
        paymentMethod: p.paymentMethod,
        tokenNumber: p.tokenNumber,
        rechargeCode: p.rechargeCode,
        status: p.status
      }))
    });
  } catch (error) {
    console.error('History error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to get history',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await db.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const meters = await db.getMetersByUserId(userId);
    const purchases = await db.getPurchasesByUserId(userId);

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        metersCount: meters.length,
        totalPurchases: purchases.length
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Get user meters
router.get('/meters', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Getting meters for userId:', userId);
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const meters = await db.getMetersByUserId(userId);
    console.log(`Found ${meters.length} meters for user ${userId}`);

    res.json({
      success: true,
      meters: meters.map(m => ({
        id: m._id,
        meterNumber: m.meterNumber,
        createdAt: m.createdAt
      }))
    });
  } catch (error) {
    console.error('Meters error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to get meters',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

// Get pending token for a meter (ESP32 endpoint - no auth required)
router.get('/pending-token/:meterNumber', async (req, res) => {
  try {
    const { meterNumber } = req.params;
    
    // Validate meter number format (13 digits)
    const meterStr = String(meterNumber).replace(/\s+/g, '').replace(/[^\d]/g, '');
    if (!/^\d{13}$/.test(meterStr)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid meter number format. Must be 13 digits' 
      });
    }

    // Find the most recent unprocessed purchase for this meter
    // A purchase is "unprocessed" if it hasn't been confirmed by the meter yet
    const purchase = await db.getPendingTokenForMeter(meterStr);
    
    if (!purchase) {
      return res.json({
        success: true,
        hasToken: false,
        message: 'No pending token for this meter'
      });
    }

    res.json({
      success: true,
      hasToken: true,
      token: {
        tokenNumber: purchase.tokenNumber,
        kwhAmount: purchase.kwhAmount,
        amountRWF: purchase.amountRWF,
        purchaseId: purchase._id.toString(),
        createdAt: purchase.createdAt
      }
    });
  } catch (error) {
    console.error('Pending token error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get pending token',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

// Confirm token was applied (ESP32 endpoint - no auth required)
router.post('/confirm-token/:purchaseId', async (req, res) => {
  try {
    const { purchaseId } = req.params;
    
    // Mark purchase as confirmed/processed
    const purchase = await db.confirmTokenApplied(purchaseId);
    
    if (!purchase) {
      return res.status(404).json({ 
        success: false,
        error: 'Purchase not found' 
      });
    }

    res.json({
      success: true,
      message: 'Token confirmed as applied',
      purchase: {
        id: purchase._id,
        meterNumber: purchase.meterNumber,
        tokenNumber: purchase.tokenNumber,
        status: purchase.status
      }
    });
  } catch (error) {
    console.error('Confirm token error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to confirm token',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

export default router;
