const mongoose = require('mongoose');
const { mongoUri } = require('../src/config/env');
const Slope = require('../models/slopes.model');

// Prototype/demo metadata for local demonstrations; not official survey data.
const slopes = [
  { slopeId: 'LM04', name: 'Lumding Cut Ridge', location: { state: 'Assam', district: 'Dima Hasao', corridor: 'NH-27 Corridor' }, coordinates: { type: 'Point', coordinates: [93.0176, 25.1842] }, elevation: 920, slopeAngle: 38, status: 'ACTIVE' },
  { slopeId: 'SK001', name: 'Gangtok Slope 01', location: { state: 'Sikkim', district: 'East Sikkim', corridor: 'NH-10 Corridor' }, coordinates: { type: 'Point', coordinates: [88.6065, 27.3389] }, elevation: 1640, slopeAngle: 34, status: 'ACTIVE' },
  { slopeId: 'ML02', name: 'Mawlynnong Escarpment', location: { state: 'Meghalaya', district: 'East Khasi Hills', corridor: 'East Khasi Hills Plateau' }, coordinates: { type: 'Point', coordinates: [91.88, 25.275] }, elevation: 1050, slopeAngle: 29, status: 'ACTIVE' },
  { slopeId: 'AP05', name: 'Tawang Valley Section', location: { state: 'Arunachal Pradesh', district: 'Tawang', corridor: 'Sela Pass West' }, coordinates: { type: 'Point', coordinates: [91.86, 27.586] }, elevation: 3048, slopeAngle: 32, status: 'ACTIVE' },
  { slopeId: 'NL01', name: 'Kohima Bypass Ridge', location: { state: 'Nagaland', district: 'Kohima', corridor: 'Kohima Bypass Transit' }, coordinates: { type: 'Point', coordinates: [94.105, 25.675] }, elevation: 1444, slopeAngle: 27, status: 'ACTIVE' },
];

async function seed() {
  if (!mongoUri) throw new Error('MONGO_URI is not configured.');
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  for (const slope of slopes) {
    await Slope.updateOne({ slopeId: slope.slopeId }, { $set: slope }, { upsert: true, runValidators: true });
    console.log(`Seeded slope ${slope.slopeId}`);
  }
}

seed().catch((error) => { console.error(`Slope seeding failed: ${error.message}`); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
