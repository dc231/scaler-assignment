const express = require('express');
const router = express.Router();
const { getAvailableSlots, createBooking,getBookings, 
    deleteBooking } = require('../controllers/bookingController');

router.get('/slots', getAvailableSlots);
router.post('/', createBooking);

router.get('/', getBookings);
router.delete('/:id', deleteBooking);

module.exports = router;