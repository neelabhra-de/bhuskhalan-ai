//require editing later

const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  slopeId: {
    type: String,
    required: true,
  },

  source: {
    type: String,
    required: true,
  },

  modelVersion: {
    type: String,
    required: true,
  },

  inputFeatures: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  prediction: {
    type: Number,
    enum: [0, 1],
    required: true,
  },

  riskProbability: {
    type: Number,
    required: true,
  },

  riskScore: {
    type: Number,
    required: true,
  },

  riskLevel: {
    type: String,
    enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Prediction', predictionSchema);
