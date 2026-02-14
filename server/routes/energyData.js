/**
 * Energy data API - same contract as api-server for ESP32 compatibility.
 * POST is unauthenticated (ESP32 sends here). GET requires auth and scopes to user's meters.
 */
import express from 'express';
import db from '../database.js';
import { verifyToken } from './auth.js';

const router = express.Router();

const getTimestamp = () => new Date().toISOString();

/**
 * POST /api/energy-data
 * Receives energy meter data from ESP32 (no auth - device endpoint).
 * Same validation and response shape as api-server.
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    if (!data.meterNumber || !data.token) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: meterNumber and token are required'
      });
    }

    if (!/^\d{13}$/.test(data.meterNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid meter number format. Must be 13 digits'
      });
    }

    if (!/^\d{20}$/.test(data.token)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token format. Must be 20 digits'
      });
    }

    const enrichedData = {
      ...data,
      serverTimestamp: getTimestamp(),
      receivedAt: Date.now()
    };

    await db.createEnergyData(enrichedData);

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
 * List energy data with optional filters. Auth required; only user's meters.
 * Query: meterNumber, token, limit, offset
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { meterNumber, token, limit = 10, offset = 0 } = req.query;

    const userMeters = await db.getMetersByUserId(userId);
    const allowedMeterNumbers = userMeters.map(m => m.meterNumber);

    if (meterNumber && !allowedMeterNumbers.includes(meterNumber)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this meter'
      });
    }

    const limitNum = parseInt(limit, 10) || 10;
    const offsetNum = parseInt(offset, 10) || 0;

    let result;
    if (meterNumber) {
      result = await db.getEnergyDataList({
        meterNumber,
        token: token || undefined,
        limit: limitNum,
        offset: offsetNum
      });
    } else {
      result = await db.getEnergyDataListForMeters(
        allowedMeterNumbers,
        limitNum,
        offsetNum
      );
    }

    if (token && result.data) {
      result.data = result.data.filter(d => d.token === token);
      result.total = result.data.length;
    }

    res.status(200).json({
      success: true,
      count: result.data.length,
      total: result.total,
      data: result.data
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
 * Latest energy data for a meter. Auth required; meter must belong to user.
 */
router.get('/:meterNumber', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { meterNumber } = req.params;

    console.log(`Getting latest energy data for meter: ${meterNumber}, user: ${userId}`);

    const userMeters = await db.getMetersByUserId(userId);
    console.log(`User has ${userMeters.length} meters:`, userMeters.map(m => m.meterNumber));
    
    const allowed = userMeters.some(m => m.meterNumber === meterNumber);

    if (!allowed) {
      console.log(`Access denied: Meter ${meterNumber} not found in user's meters`);
      return res.status(403).json({
        success: false,
        error: 'Access denied to this meter. Meter not registered to your account.'
      });
    }

    const latest = await db.getLatestEnergyDataByMeter(meterNumber);

    if (!latest) {
      console.log(`No energy data found for meter: ${meterNumber}`);
      return res.status(404).json({
        success: false,
        error: 'No data found for the specified meter number. Meter may not have sent any data yet.'
      });
    }

    res.status(200).json({
      success: true,
      data: latest
    });
  } catch (error) {
    console.error('Error retrieving meter data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

export default router;
