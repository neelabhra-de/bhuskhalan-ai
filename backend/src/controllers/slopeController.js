const Slope = require('../../models/slopes.model');
const { getDatabaseStatus } = require('../config/db');

function databaseUnavailable(next) {
  if (getDatabaseStatus() === 'CONNECTED') return false;
  const error = new Error('Database service is currently unavailable');
  error.statusCode = 503;
  error.isOperational = true;
  next(error);
  return true;
}

async function listSlopes(req, res, next) {
  if (databaseUnavailable(next)) return;
  try {
    const slopes = await Slope.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: slopes });
  } catch (error) {
    return next(error);
  }
}

async function getSlope(req, res, next) {
  if (databaseUnavailable(next)) return;
  try {
    const slope = await Slope.findOne({ slopeId: req.params.slopeId }).lean();
    if (!slope) {
      const error = new Error('Slope not found');
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }
    return res.json({ success: true, data: slope });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listSlopes, getSlope };
