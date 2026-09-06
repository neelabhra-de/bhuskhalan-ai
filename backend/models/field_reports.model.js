const mongoose = require('mongoose');

const fieldReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
  },

  slopeId: {
    type: String,
    required: true,
  },

  observationType: {
    type: String,
    required: true,
  },

  severityLevel: {
    type: String,
    required: true,
  },

  location: {
    type: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  notes: {
    type: String,
    required: true,
  },

  photos: {
    type: [String],
    required: true,
  },

  reportedBy: {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },

  verificationStatus: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('FieldReport', fieldReportSchema);
