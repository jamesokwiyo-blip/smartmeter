/**
 * Energy data routes - live PZEM data from ESP32 (file-based storage).
 * GET /api/energy-data/:meterNumber - latest data for dashboard/Meter Diagnostics.
 * POST /api/energy-data - receive data from ESP32 (optional, can use backend on 3000).
 */
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const dataDir = path.join(__dirname, '..', 'data', 'energy');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const saveDataToFile = (data) => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `energy_data_${timestamp}.json`;
  const filepath = path.join(dataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  return filepath;
};

/** POST /api/energy-data - receive from ESP32 */
router.post('/energy-data', (req, res) => {
  try {
    const data = req.body;
    if (!data.meterNumber || !data.token) {
      return res.status(400).json({ success: false, error: 'meterNumber and token required' });
    }
    if (!/^\d{13}$/.test(data.meterNumber)) {
      return res.status(400).json({ success: false, error: 'meterNumber must be 13 digits' });
    }
    if (!/^\d{20}$/.test(data.token)) {
      return res.status(400).json({ success: false, error: 'token must be 20 digits' });
    }
    const enriched = { ...data, serverTimestamp: getTimestamp(), receivedAt: Date.now() };
    saveDataToFile(enriched);
    return res.status(200).json({
      success: true,
      message: 'Energy data received',
      data: { meterNumber: data.meterNumber, token: data.token, remainingKwh: data.remainingKwh, receivedAt: enriched.serverTimestamp },
    });
  } catch (err) {
    console.error('Energy data POST error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/** GET /api/energy-data/:meterNumber - public, no auth required (device data for dashboard) */
router.get('/energy-data/:meterNumber', (req, res) => {
  try {
    const { meterNumber } = req.params;
    const files = fs.readdirSync(dataDir)
      .filter((f) => f.startsWith('energy_data_') && f.endsWith('.json'))
      .sort()
      .reverse();
    for (const file of files) {
      const filepath = path.join(dataDir, file);
      const fileData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      if (fileData.meterNumber === meterNumber) {
        return res.status(200).json({ success: true, data: fileData });
      }
    }
    return res.status(404).json({ success: false, error: 'No data found for this meter' });
  } catch (err) {
    console.error('Energy data GET error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
