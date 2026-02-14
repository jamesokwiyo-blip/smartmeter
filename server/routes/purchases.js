import express from 'express';
import db from '../database.js';
import { verifyToken } from './auth.js';
import crypto from 'crypto';

const router = express.Router();

// Generate unique token and recharge code
function generateTokenAndCode() {
  // Generate 20-digit token number
  const tokenNumber = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
  
  return {
    tokenNumber,
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

    // Calculate kWh (1 kWh = 125 RWF)
    const kwhAmount = parseFloat((amountRWF / 125).toFixed(2));

    // Generate token and code
    const { tokenNumber, rechargeCode } = generateTokenAndCode();

    // Create meter if needed
    await db.createMeter(userId, meterNumber);

    // Create purchase
    const purchase = await db.createPurchase(
      userId,
      meterNumber,
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
    const purchases = await db.getPurchasesByUserId(userId);

    res.json({
      success: true,
      purchases: purchases.map(p => ({
        id: p._id,
        date: new Date(p.date).toLocaleDateString(),
        meterNumber: p.meterNumber,
        amount: p.amountRWF,
        kwh: p.kwhAmount,
        paymentMethod: p.paymentMethod,
        tokenNumber: p.tokenNumber,
        rechargeCode: p.rechargeCode,
        status: p.status
      }))
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to get history' });
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
    const meters = await db.getMetersByUserId(userId);

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
    res.status(500).json({ error: 'Failed to get meters' });
  }
});

export default router;
