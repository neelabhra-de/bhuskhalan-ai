const express = require('express');
const {
  listPredictions,
} = require('../controllers/predictionHistoryController');

const router = express.Router();

router.get('/', listPredictions);

module.exports = router;
