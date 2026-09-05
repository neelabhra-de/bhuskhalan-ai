const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  slopeId: {
    type: String,
    required: true
  },

  timestamp: {
    type: Date,
    required: true
  },

  rainfall24h: {
    type: Number,
    required: true
  },

  rainfall72h: {
    type: Number,
    required: true
  },

  soilMoisture: {
    type: Number,
    required: true
  },

  poreWaterPressure: {
    type: Number,
    required: true
  },

  displacement24h: {
    type: Number,
    required: true
  },

  displacementRate: {
    type: Number,
    required: true
  },

  factorOfSafety: {
    type: Number,
    required: true
  },

  seismicAcceleration: {
    type: Number,
    required: true
  },

  source: {
    type: String,
    required: true
  }
});

// Required index: slopeId + timestamp
sensorReadingSchema.index({
  slopeId: 1,
  timestamp: 1
});

module.exports = mongoose.model('SensorReading', sensorReadingSchema);