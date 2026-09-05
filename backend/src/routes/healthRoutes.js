const express = require('express');
const { mlServiceUrl } = require('../config/env');
const { getDatabaseStatus } = require('../config/db');

const router = express.Router();
router.get('/', (req, res) => {
  const database = getDatabaseStatus();
  return res.json({
    status: database === 'CONNECTED' ? 'OK' : 'DEGRADED',
    service: 'Bhuskhalan AI Backend',
    database,
    mlService: mlServiceUrl ? 'CONFIGURED' : 'NOT_CONFIGURED',
  });
});

module.exports = router;
