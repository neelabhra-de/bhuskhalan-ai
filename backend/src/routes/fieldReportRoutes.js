const express = require('express');
const { listFieldReports, createFieldReport } = require('../controllers/fieldReportController');

const router = express.Router();
router.get('/', listFieldReports);
router.post('/', createFieldReport);

module.exports = router;
