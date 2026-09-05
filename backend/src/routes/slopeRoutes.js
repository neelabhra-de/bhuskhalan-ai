const express = require('express');
const { listSlopes, getSlope } = require('../controllers/slopeController');

const router = express.Router();

router.get('/', listSlopes);
router.get('/:slopeId', getSlope);

module.exports = router;
