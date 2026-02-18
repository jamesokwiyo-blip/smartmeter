import express from 'express';
import db from '../database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Generate a 20-digit decimal token (matches ESP32 expected format)
function generate20DigitToken() {
  // Build 20 random decimal digits ensuring first digit is never 0
  const digits = [];
  digits.push(String(Math.floor(Math.random() * 9) + 1)); // first digit 1-9
  for (let i = 1; i < 20; i++) {
    digits.push(String(Math.floor(Math.random() * 10)));
  }
  return digits.join('');
}

// Short human-readable recharge code shown in purchase receipt
function generateRechargeCode() {
  const seg = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${seg()}-${seg()}`;
}

function generateTokenAndCode() {
  return {
    tokenNumber: generate20DigitToken(),
    rechargeCode: generateRechargeCode(),
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

    // Create purchase with PENDING status — device must confirm receipt
    const purchase = await db.createPurchase(
      userId,
      meterNumber,
      amountRWF,
      kwhAmount,
      paymentMethod,
      mobileNumber || null,
      tokenNumber,
      rechargeCode,
      'PENDING'
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

/**
 * GET /purchases/pending-token/:meterNumber
 * ESP32 polls this every 10s to receive a freshly purchased token.
 * Returns the most recent PENDING purchase for this meter.
 */
router.get('/pending-token/:meterNumber', async (req, res) => {
  try {
    const { meterNumber } = req.params;
    const purchases = await db.getPurchasesByMeterNumber(meterNumber);

    // Find most recent PENDING purchase
    const pending = purchases.find(p => p.status === 'PENDING');

    if (pending) {
      return res.json({
        success: true,
        hasToken: true,
        token: {
          purchaseId: pending._id.toString(),
          tokenNumber: pending.tokenNumber,
          kwhAmount: pending.kwhAmount,
          rechargeCode: pending.rechargeCode,
        },
      });
    }

    return res.json({ success: true, hasToken: false });
  } catch (error) {
    console.error('Pending token error:', error);
    res.status(500).json({ success: false, error: 'Failed to check pending token' });
  }
});

/**
 * POST /purchases/confirm-token/:purchaseId
 * ESP32 calls this after successfully applying the token to mark it DELIVERED.
 */
router.post('/confirm-token/:purchaseId', async (req, res) => {
  try {
    const { purchaseId } = req.params;
    await db.updatePurchaseStatus(purchaseId, 'DELIVERED');
    return res.json({ success: true, message: 'Token confirmed as delivered' });
  } catch (error) {
    console.error('Confirm token error:', error);
    res.status(500).json({ success: false, error: 'Failed to confirm token' });
  }
});

export default router;
