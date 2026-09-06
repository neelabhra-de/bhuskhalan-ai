const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  slopeId: {
    type: String,
    required: true,
  },

  baseline: {
    rainfall72h: {
      type: Number,
      required: true,
    },
    soilMoisture: {
      type: Number,
      required: true,
    },
    displacement24h: {
      type: Number,
      required: true,
    },
    factorOfSafety: {
      type: Number,
      required: true,
    },
  },

  scenarioInputs: {
    additionalPrecipitation: {
      type: Number,
      required: true,
    },
    soilMoisture: {
      type: Number,
      required: true,
    },
    seismicMicroTremor: {
      type: Number,
      required: true,
    },
  },

  result: {
    prediction: {
      type: Number,
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
      required: true,
    },
  },

  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Simulation', simulationSchema);
