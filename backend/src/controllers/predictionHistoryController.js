const Prediction = require('../../models/predictions.model');
const { getDatabaseStatus } = require('../config/db');

async function listPredictions(req, res, next) {
  if (getDatabaseStatus() !== 'CONNECTED') {
    const error = new Error('Database service is currently unavailable');
    error.statusCode = 503;
    error.isOperational = true;
    return next(error);
  }

  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 20;
    const filter = req.query.slopeId ? { slopeId: req.query.slopeId } : {};
    const predictions = await Prediction.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({ success: true, data: predictions });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listPredictions };
