const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Add payment details
router.post("/", async (req, res) => {
  const { bookingId, paymentAmount, paymentMethod, paymentDate, paymentStatus } = req.body;

  try {
    const newPayment = await pool.query(
      `INSERT INTO payments (booking_id, payment_amount, payment_method, payment_date, payment_status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [bookingId, paymentAmount, paymentMethod, paymentDate, paymentStatus]
    );

    res.status(201).json({ message: "Payment added", payment: newPayment.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get payment details by booking ID
router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    const payment = await pool.query("SELECT * FROM payments WHERE booking_id = $1", [bookingId]);
    res.json(payment.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
