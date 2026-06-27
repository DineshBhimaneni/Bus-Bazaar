const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllBuses, searchBuses, getBusById, createBus, updateBus, deleteBus } = require('../controllers/busController');

// Routes
router.get('/', getAllBuses);
router.get('/search', searchBuses);
router.get('/:id', getBusById);

// Admin Routes
router.post('/', protect, createBus);
router.put('/:id', protect, updateBus);
router.delete('/:id', protect, deleteBus);

module.exports = router;
