const mongoose = require('mongoose');

// Define the Review schema
const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, // Reference to the Service model
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating should be between 1 and 5
    review: { type: String, default: '' }, // Review text (optional)
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
