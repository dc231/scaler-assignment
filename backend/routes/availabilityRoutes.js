const express = require('express');
const router = express.Router();
const { getAvailability, updateAvailability } = require('../controllers/availabilityController');

router.get('/', getAvailability);
router.post('/', updateAvailability);

module.exports = router;