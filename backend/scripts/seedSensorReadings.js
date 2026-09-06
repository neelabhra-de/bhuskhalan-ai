const mongoose = require('mongoose');
const { mongoUri } = require('../src/config/env');
const SensorReading = require('../models/sensor_readings.model');
const Slope = require('../models/slopes.model');

// Deterministic prototype/demo telemetry for local demonstrations; not live sensor data.
const bases = {
  LM04: { rainfall24h: 198, rainfall72h: 420, soilMoisture: 94, poreWaterPressure: 92, displacement24h: 11.4, displacementRate: 0.48, factorOfSafety: 1.08, seismicAcceleration: 0.22 },
  SK001: { rainfall24h: 184, rainfall72h: 320, soilMoisture: 91.2, poreWaterPressure: 78, displacement24h: 7.2, displacementRate: 0.3, factorOfSafety: 1.14, seismicAcceleration: 0.12 },
  ML02: { rainfall24h: 110, rainfall72h: 240, soilMoisture: 76, poreWaterPressure: 51, displacement24h: 1.8, displacementRate: 0.08, factorOfSafety: 1.38, seismicAcceleration: 0.08 },
  AP05: { rainfall24h: 94, rainfall72h: 190, soilMoisture: 68, poreWaterPressure: 42, displacement24h: 1.2, displacementRate: 0.05, factorOfSafety: 1.42, seismicAcceleration: 0.06 },
  NL01: { rainfall24h: 42, rainfall72h: 105, soilMoisture: 45, poreWaterPressure: 26, displacement24h: 0.4, displacementRate: 0.02, factorOfSafety: 1.85, seismicAcceleration: 0.03 },
};

async function seed() {
  if (!mongoUri) throw new Error('MONGO_URI is not configured.');
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  const existingSlopes = await Slope.find({ slopeId: { $in: Object.keys(bases) } }).select('slopeId').lean();
  const available = new Set(existingSlopes.map((slope) => slope.slopeId));
  const operations = [];
  for (const [slopeId, base] of Object.entries(bases)) {
    if (!available.has(slopeId)) continue;
    for (let index = 0; index < 5; index += 1) {
      const timestamp = new Date(Date.UTC(2026, 8, 6, 12 - index * 2, 0, 0));
      const factor = 1 - index * 0.01;
      operations.push({
        updateOne: {
          filter: { slopeId, timestamp, source: 'PROTOTYPE_DEMO' },
          update: { $set: { slopeId, timestamp, source: 'PROTOTYPE_DEMO', rainfall24h: +(base.rainfall24h * factor).toFixed(2), rainfall72h: +(base.rainfall72h * factor).toFixed(2), soilMoisture: +(base.soilMoisture * factor).toFixed(2), poreWaterPressure: +(base.poreWaterPressure * factor).toFixed(2), displacement24h: +(base.displacement24h * factor).toFixed(2), displacementRate: +(base.displacementRate * factor).toFixed(3), factorOfSafety: +(base.factorOfSafety + index * 0.01).toFixed(2), seismicAcceleration: +(base.seismicAcceleration * factor).toFixed(3) } },
          upsert: true,
        },
      });
    }
  }
  if (operations.length) await SensorReading.bulkWrite(operations);
  console.log(`Seeded/updated ${operations.length} PROTOTYPE_DEMO sensor readings.`);
}

seed().catch((error) => { console.error(`Sensor seeding failed: ${error.message}`); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
