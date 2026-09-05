const { getPrediction } = require('../services/mlService');

const predictionFields = [
  'Rainfall_mm', 'Rainfall_3Day', 'Rainfall_7Day', 'Slope_Angle', 'Elevation_m',
  'Soil_Saturation', 'Historical_Landslide_Count', 'Pore_Water_Pressure_kPa',
  'Soil_Moisture_Content', 'Microseismic_Activity', 'Acoustic_Emission_dB',
  'Soil_Strain', 'Soil_Erosion_Rate', 'NDVI_Index', 'Vegetation_Cover',
  'Distance_to_Road_m', 'Proximity_to_Water', 'Earthquake_Activity', 'TDR_Reflection_Index',
];

async function predict(req, res, next) {
  const input = req.body || {};
  const missingFields = predictionFields.filter((field) => !(field in input));
  const invalidFields = predictionFields.filter(
    (field) => field in input && (typeof input[field] !== 'number' || !Number.isFinite(input[field])),
  );

  if (missingFields.length || invalidFields.length) {
    const details = [];
    if (missingFields.length) details.push(`missing fields: ${missingFields.join(', ')}`);
    if (invalidFields.length) details.push(`invalid numeric fields: ${invalidFields.join(', ')}`);
    const error = new Error(`Invalid prediction input (${details.join('; ')})`);
    error.statusCode = 400;
    error.isOperational = true;
    return next(error);
  }

  const orderedInput = Object.fromEntries(predictionFields.map((field) => [field, input[field]]));
  try {
    const data = await getPrediction(orderedInput);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

module.exports = { predict };
