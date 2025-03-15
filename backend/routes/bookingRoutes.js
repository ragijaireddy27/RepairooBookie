const express = require("express");
const router = express.Router();
const {
  getBookings,
  createBooking,
  updateBookingStatus,
  getUserBookings,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

// Get all bookings (for workers)
router.get("/worker/bookings", protect, getBookings);

// Get user's bookings (for users to view their bookings)
router.get("/user/bookings", protect, getUserBookings);

// Create a booking (for users to book a service)
router.post("/user/bookings", protect, createBooking);

// Update booking status (for workers to accept or complete bookings)
router.put("/worker/bookings/:bookingId", protect, updateBookingStatus);

module.exports = router;
