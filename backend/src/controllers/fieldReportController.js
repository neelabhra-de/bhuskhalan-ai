const FieldReport = require('../../models/field_reports.model');
const Slope = require('../../models/slopes.model');
const { getDatabaseStatus } = require('../config/db');

function ready(next) { if (getDatabaseStatus() === 'CONNECTED') return true; const error = new Error('Database service is currently unavailable'); error.statusCode = 503; error.isOperational = true; next(error); return false; }
function validCoordinates(location) { return location && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2 && location.coordinates.every(Number.isFinite) && location.coordinates[0] >= -180 && location.coordinates[0] <= 180 && location.coordinates[1] >= -90 && location.coordinates[1] <= 90; }

async function listFieldReports(req, res, next) {
  if (!ready(next)) return;
  const limitValue = Number.parseInt(req.query.limit, 10); const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : 20;
  const filter = {}; for (const key of ['slopeId', 'severityLevel', 'verificationStatus']) if (req.query[key]) filter[key] = req.query[key];
  try { return res.json({ success: true, data: await FieldReport.find(filter).sort({ createdAt: -1 }).limit(limit).lean() }); } catch (error) { return next(error); }
}

async function createFieldReport(req, res, next) {
  if (!ready(next)) return;
  const input = req.body || {}; const missing = ['slopeId', 'observationType', 'severityLevel', 'location', 'notes', 'reportedBy', 'verificationStatus'].filter((field) => input[field] === undefined || input[field] === ''); const invalid = [];
  if (input.location && !validCoordinates(input.location)) invalid.push('location (GeoJSON Point [longitude, latitude])');
  if (!input.reportedBy || typeof input.reportedBy !== 'object' || !input.reportedBy.name || !input.reportedBy.role) invalid.push('reportedBy');
  if (missing.length || invalid.length) { const error = new Error(`Invalid field report (${[missing.length ? `missing fields: ${missing.join(', ')}` : '', invalid.length ? `invalid fields: ${invalid.join(', ')}` : ''].filter(Boolean).join('; ')})`); error.statusCode = 400; error.isOperational = true; return next(error); }
  if (!(await Slope.exists({ slopeId: input.slopeId.trim() }))) { const error = new Error(`Slope not found: ${input.slopeId}`); error.statusCode = 400; error.isOperational = true; return next(error); }
  try { const report = await FieldReport.create({ ...input, slopeId: input.slopeId.trim(), createdAt: new Date() }); return res.status(201).json({ success: true, data: report }); } catch (error) { return next(error); }
}

module.exports = { listFieldReports, createFieldReport };
