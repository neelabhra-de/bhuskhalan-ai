const Alert = require('../../models/alerts.model');
const { getDatabaseStatus } = require('../config/db');

const statuses = ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'MUTED'];
const severities = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];

function ready(next) {
  if (getDatabaseStatus() === 'CONNECTED') return true;
  const error = new Error('Database service is currently unavailable'); error.statusCode = 503; error.isOperational = true; next(error); return false;
}

async function listAlerts(req, res, next) {
  if (!ready(next)) return;
  const limitValue = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : 20;
  const filter = {};
  for (const key of ['status', 'severity', 'slopeId']) if (req.query[key]) filter[key] = req.query[key];
  if (filter.status && !statuses.includes(filter.status) || filter.severity && !severities.includes(filter.severity)) {
    const error = new Error('Invalid alert status or severity filter'); error.statusCode = 400; error.isOperational = true; return next(error);
  }
  try { return res.json({ success: true, data: await Alert.find(filter).sort({ createdAt: -1 }).limit(limit).lean() }); }
  catch (error) { return next(error); }
}

async function updateAlert(req, res, next) {
  if (!ready(next)) return;
  const { status, acknowledgedBy, acknowledgedAt } = req.body || {};
  if (!statuses.includes(status)) { const error = new Error(`Invalid alert status. Expected one of: ${statuses.join(', ')}`); error.statusCode = 400; error.isOperational = true; return next(error); }
  const update = { status, updatedAt: new Date() };
  if (status === 'ACKNOWLEDGED') {
    if (!acknowledgedBy || typeof acknowledgedBy !== 'string') { const error = new Error('acknowledgedBy is required when status is ACKNOWLEDGED'); error.statusCode = 400; error.isOperational = true; return next(error); }
    update.acknowledgedBy = acknowledgedBy;
    update.acknowledgedAt = acknowledgedAt ? new Date(acknowledgedAt) : new Date();
  }
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).lean();
    if (!alert) { const error = new Error('Alert not found'); error.statusCode = 404; error.isOperational = true; return next(error); }
    return res.json({ success: true, data: alert });
  } catch (error) { return next(error); }
}

module.exports = { listAlerts, updateAlert };
