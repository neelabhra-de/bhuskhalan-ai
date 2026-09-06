const express = require('express');
const { createSimulation, listSimulations } = require('../controllers/simulationController');

const router = express.Router();
router.get('/', listSimulations);
router.post('/', createSimulation);

module.exports = router;
