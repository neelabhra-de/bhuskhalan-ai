const mongoose = require('mongoose');

const slopeSchema = new mongoose.Schema(
  {
    slopeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      state: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      corridor: {
        type: String,
        required: true,
        trim: true,
      },
    },

    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },

      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) {
            return (
              value.length === 2 &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },
          message:
            'Coordinates must be [longitude, latitude] with valid ranges.',
        },
      },
    },

    elevation: {
      type: Number,
      required: true,
    },

    slopeAngle: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'],
      default: 'ACTIVE',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'slopes',
  }
);

// Geospatial index
slopeSchema.index({
  coordinates: '2dsphere',
});

module.exports = mongoose.model('Slope', slopeSchema);
