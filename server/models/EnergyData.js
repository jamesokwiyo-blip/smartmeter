import mongoose from 'mongoose';

/**
 * Energy data sent by ESP32 smart meter (same contract as api-server).
 * POST /api/energy-data from ESP32 stores here.
 */
const energyDataSchema = new mongoose.Schema({
  meterNumber: { type: String, required: true, index: true },
  token: { type: String, required: true },
  clientName: { type: String, default: '' },
  clientTIN: { type: String, default: '' },
  clientPhone: { type: String, default: '' },
  remainingKwh: { type: Number, default: 0 },
  sessionDuration: { type: Number, default: 0 },
  voltage: { type: Number, default: null },
  current: { type: Number, default: null },
  power: { type: Number, default: null },
  totalEnergy: { type: Number, default: null },
  frequency: { type: Number, default: null },
  powerFactor: { type: Number, default: null },
  timestamp: { type: Number, default: null },
  timestampFormatted: { type: String, default: '' },  // ISO 8601 formatted timestamp for readability
  serverTimestamp: { type: String, default: '' },
  receivedAt: { type: Number, default: null }
}, { timestamps: true });

// Index for latest-by-meter queries
energyDataSchema.index({ meterNumber: 1, createdAt: -1 });

const EnergyData = mongoose.model('EnergyData', energyDataSchema);

export default EnergyData;
