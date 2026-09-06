const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT) || 5000,
  mlServiceUrl: (process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000').trim().replace(/\/+$/, ''),
  mongoUri: process.env.MONGO_URI || '',
  frontendOrigins: (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
};
