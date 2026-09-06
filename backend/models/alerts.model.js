const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
  },

  slopeId: {
    type: String,
    required: true,
  },

  predictionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Prediction',
  },

  severity: {
    type: String,
    enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  riskScore: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'MUTED'],
    required: true,
  },

  acknowledgedBy: {
    type: String,
    default: null,
  },

  acknowledgedAt: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    required: true,
  },

  updatedAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Alert', alertSchema);
