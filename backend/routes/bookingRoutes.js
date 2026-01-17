const express = require('express');
const router = express.Router();
const { getAvailableSlots, createBooking } = require('../controllers/bookingController');

router.get('/slots', getAvailableSlots);
router.post('/', createBooking);

module.exports = router;