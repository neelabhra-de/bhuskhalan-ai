const express = require('express');
const { listAlerts, updateAlert } = require('../controllers/alertController');

const router = express.Router();
router.get('/', listAlerts);
router.patch('/:id', updateAlert);

module.exports = router;
