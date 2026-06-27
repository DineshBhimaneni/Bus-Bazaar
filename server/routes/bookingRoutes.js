const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getBookedSeats,
  getAllBookingsAdmin
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/seats/:routeId', getBookedSeats);
router.get('/admin/all', protect, getAllBookingsAdmin);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
