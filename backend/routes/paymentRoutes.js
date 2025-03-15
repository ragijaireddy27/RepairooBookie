const express = require("express");
const Payment = require("../models/Payment"); // Mongoose model for Payment
const router = express.Router();

// Add payment details
router.post("/", async (req, res) => {
  const { bookingId, paymentAmount, paymentMethod, paymentDate, paymentStatus } = req.body;

  try {
    const newPayment = await Payment.create({
      bookingId,
      paymentAmount,
      paymentMethod,
      paymentDate,
      paymentStatus,
    });

    res.status(201).json({ message: "Payment added", payment: newPayment });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get payment details by booking ID
router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    const payments = await Payment.find({ bookingId });

    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found for this booking ID" });
    }

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
