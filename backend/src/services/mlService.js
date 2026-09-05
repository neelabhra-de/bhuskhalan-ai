const axios = require('axios');
const { mlServiceUrl } = require('../config/env');

async function getPrediction(input) {
  try {
    const response = await axios.post(`${mlServiceUrl}/predict`, input, { timeout: 10000 });
    return response.data;
  } catch (error) {
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
