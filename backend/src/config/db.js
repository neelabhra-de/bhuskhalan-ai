const mongoose = require('mongoose');
const { mongoUri } = require('./env');

async function connectDatabase() {
  if (!mongoUri) {
    console.error('MongoDB connection skipped: MONGO_URI is not configured.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

function getDatabaseStatus() {
  const states = ['DISCONNECTED', 'CONNECTED', 'CONNECTING', 'DISCONNECTING'];
  return states[mongoose.connection.readyState] || 'UNKNOWN';
}

module.exports = { connectDatabase, getDatabaseStatus };
