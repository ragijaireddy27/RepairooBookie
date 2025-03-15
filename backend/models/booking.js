const mongoose = require('mongoose');

// Define the Booking schema
const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDate: { type: Date, required: true },
    status: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
