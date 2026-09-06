const express = require('express');
const { listReadings, listSlopeReadings, createReading } = require('../controllers/sensorReadingController');

const router = express.Router();
router.get('/', listReadings);
router.get('/:slopeId', listSlopeReadings);
router.post('/', createReading);

module.exports = router;
