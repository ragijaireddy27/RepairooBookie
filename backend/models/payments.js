const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Reference to the Booking model
    paymentAmount: { type: Number, required: true }, // Payment amount
    paymentMethod: { type: String, required: true, enum: ['offline', 'credit_card', 'debit_card'] }, // Only 'offline' is allowed for offline payment
    paymentDate: { type: Date, required: true },
    paymentStatus: { type: String, required: true, enum: ['pending', 'completed', 'failed'] }, // Payment status
    otherCharges: { type: Number, default: 0 }, // Additional charges if any
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
