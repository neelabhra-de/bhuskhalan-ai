const Simulation = require('../../models/simulations.model');
const Slope = require('../../models/slopes.model');
const { getDatabaseStatus } = require('../config/db');

const numericFields = [
  ['baseline', 'rainfall72h'], ['baseline', 'soilMoisture'],
  ['baseline', 'displacement24h'], ['baseline', 'factorOfSafety'],
  ['scenarioInputs', 'additionalPrecipitation'], ['scenarioInputs', 'soilMoisture'],
  ['scenarioInputs', 'seismicMicroTremor'],
  ['result', 'prediction'], ['result', 'riskProbability'],
  ['result', 'riskScore'],
];

function requireDatabase(next) {
  if (getDatabaseStatus() === 'CONNECTED') return true;
  const error = new Error('Database service is currently unavailable');
  error.statusCode = 503;
  error.isOperational = true;
  next(error);
  return false;
}

function validateSimulation(input) {
  const missing = [];
  const invalid = [];
  if (!input.slopeId || typeof input.slopeId !== 'string') missing.push('slopeId');
  for (const [group, field] of numericFields) {
    if (!input[group] || input[group][field] === undefined) missing.push(`${group}.${field}`);
    else if (typeof input[group][field] !== 'number' || !Number.isFinite(input[group][field])) invalid.push(`${group}.${field}`);
  }
  if (input.result && !['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(input.result.riskLevel)) invalid.push('result.riskLevel');
  return { missing, invalid };
}

async function createSimulation(req, res, next) {
  if (!requireDatabase(next)) return;
  const input = req.body || {};
  const { missing, invalid } = validateSimulation(input);
  if (missing.length || invalid.length) {
    const details = [];
    if (missing.length) details.push(`missing fields: ${missing.join(', ')}`);
    if (invalid.length) details.push(`invalid fields: ${invalid.join(', ')}`);
    const error = new Error(`Invalid simulation input (${details.join('; ')})`);
    error.statusCode = 400;
    error.isOperational = true;
    return next(error);
  }
  if (!(await Slope.exists({ slopeId: input.slopeId.trim() }))) {
    const error = new Error(`Slope not found: ${input.slopeId}`);
    error.statusCode = 400;
    error.isOperational = true;
    return next(error);
  }
  try {
    const simulation = await Simulation.create({ ...input, slopeId: input.slopeId.trim(), createdAt: new Date() });
    return res.status(201).json({ success: true, data: simulation });
  } catch (error) {
    return next(error);
  }
}

async function listSimulations(req, res, next) {
  if (!requireDatabase(next)) return;
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 20;
  const filter = req.query.slopeId ? { slopeId: req.query.slopeId } : {};
  try {
    const simulations = await Simulation.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    return res.json({ success: true, data: simulations });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createSimulation, listSimulations };
