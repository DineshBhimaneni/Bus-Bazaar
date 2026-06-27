const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      bus_id, route_id, seat_numbers,
      passenger_name, passenger_age, passenger_gender,
      passenger_email, passenger_phone, total_fare
    } = req.body;

    if (!bus_id || !route_id || !seat_numbers || !passenger_name || !passenger_age || !passenger_phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const bookingId = await Booking.createBooking({
      user_id: req.userId,
      bus_id, route_id, seat_numbers,
      passenger_name, passenger_age, passenger_gender,
      passenger_email, passenger_phone, total_fare
    });

    const booking = await Booking.getBookingById(bookingId);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.getBookingsByUser(req.userId);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const cancelled = await Booking.cancelBooking(req.params.id, req.userId);
    if (!cancelled) {
      return res.status(400).json({ message: 'Booking not found or cannot be cancelled' });
    }
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booked seats for a route
// @route   GET /api/bookings/seats/:routeId
// @access  Public
const getBookedSeats = async (req, res) => {
  try {
    const bookedSeats = await Booking.getBookedSeats(req.params.routeId);
    res.json(bookedSeats);
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getBookedSeats,
  getAllBookingsAdmin
};
