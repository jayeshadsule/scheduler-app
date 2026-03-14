const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/:link', bookingController.getAvailabilityByLink);
router.post('/book', bookingController.bookSlot);

module.exports = router;
