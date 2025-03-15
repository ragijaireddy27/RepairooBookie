const express = require("express");
const router = express.Router();
const {
  getBookings,
  createBooking,
  updateBookingStatus,
  getUserBookings,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware"); // Protect middleware for authorization

// Get all bookings for workers (authenticated route)
router.get("/worker/bookings", protect, getBookings);

// Get all bookings for the authenticated user
router.get("/user/bookings", protect, getUserBookings);

// Create a new booking for the user (users can book services)
router.post("/user/bookings", protect, createBooking);

// Update booking status (for workers to accept or complete bookings)
router.put("/worker/bookings/:bookingId", protect, updateBookingStatus);

module.exports = router;
