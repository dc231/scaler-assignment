const express = require('express');
const router = express.Router();
const { getEventTypes, createEventType, deleteEventType } = require('../controllers/eventTypeController');

router.get('/', getEventTypes);
router.post('/', createEventType);
router.delete('/:id', deleteEventType);

module.exports = router;