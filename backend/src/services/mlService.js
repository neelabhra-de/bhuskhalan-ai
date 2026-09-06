const axios = require('axios');
const { mlServiceUrl } = require('../config/env');

async function getPrediction(input) {
  const predictionUrl = `${mlServiceUrl}/predict`;
  try {
    const response = await axios.post(predictionUrl, input, { timeout: 10000 });
    return response.data;
  } catch (error) {
    const upstreamStatus = error.response?.status || 'none';
    const upstreamBody = error.response?.data || 'none';
    console.error(`[ML] Prediction request failed | url=${predictionUrl} | status=${upstreamStatus} | message=${error.message} | response=${JSON.stringify(upstreamBody)}`);
    const unavailable = !error.response || error.code === 'ECONNABORTED';
    const serviceError = new Error(unavailable
      ? 'ML prediction service is currently unavailable'
      : 'ML prediction service returned an error');
    serviceError.statusCode = unavailable ? 503 : 500;
    serviceError.isOperational = true;
    throw serviceError;
  }
}

module.exports = { getPrediction };
