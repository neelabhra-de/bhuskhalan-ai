const SensorReading = require('../../models/sensor_readings.model');
const Slope = require('../../models/slopes.model');
const { getDatabaseStatus } = require('../config/db');

const numericFields = ['rainfall24h', 'rainfall72h', 'soilMoisture', 'poreWaterPressure', 'displacement24h', 'displacementRate', 'factorOfSafety', 'seismicAcceleration'];

function databaseReady(next) {
  if (getDatabaseStatus() === 'CONNECTED') return true;
  const error = new Error('Database service is currently unavailable');
  error.statusCode = 503;
  error.isOperational = true;
  next(error);
  return false;
}

function validateReading(input) {
  const missing = ['slopeId', 'timestamp', 'source', ...numericFields].filter((field) => input[field] === undefined || input[field] === '');
  const invalid = numericFields.filter((field) => input[field] !== undefined && (typeof input[field] !== 'number' || !Number.isFinite(input[field])));
  if (input.timestamp !== undefined && Number.isNaN(Date.parse(input.timestamp))) invalid.push('timestamp');
  return { missing, invalid };
}

async function listReadings(req, res, next) {
  if (!databaseReady(next)) return;
  const limitValue = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : 20;
  const filter = req.query.slopeId ? { slopeId: req.query.slopeId } : {};
  try {
    const readings = await SensorReading.find(filter).sort({ timestamp: -1 }).limit(limit).lean();
    return res.json({ success: true, data: readings });
  } catch (error) { return next(error); }
}

async function listSlopeReadings(req, res, next) {
  req.query.slopeId = req.params.slopeId;
  return listReadings(req, res, next);
}

async function createReading(req, res, next) {
  if (!databaseReady(next)) return;
  const input = req.body || {};
  const { missing, invalid } = validateReading(input);
  if (missing.length || invalid.length) {
    const details = [];
    if (missing.length) details.push(`missing fields: ${missing.join(', ')}`);
    if (invalid.length) details.push(`invalid fields: ${invalid.join(', ')}`);
    const error = new Error(`Invalid sensor reading (${details.join('; ')})`);
    error.statusCode = 400; error.isOperational = true; return next(error);
  }
  if (!(await Slope.exists({ slopeId: input.slopeId.trim() }))) {
    const error = new Error(`Slope not found: ${input.slopeId}`);
    error.statusCode = 400; error.isOperational = true; return next(error);
  }
  try {
    const reading = await SensorReading.create({ ...input, slopeId: input.slopeId.trim(), timestamp: new Date(input.timestamp) });
    return res.status(201).json({ success: true, data: reading });
  } catch (error) { return next(error); }
}

module.exports = { listReadings, listSlopeReadings, createReading };
