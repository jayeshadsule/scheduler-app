const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save', authMiddleware, availabilityController.saveAvailability);
router.post('/generate-link', authMiddleware, availabilityController.generateLink);

module.exports = router;
