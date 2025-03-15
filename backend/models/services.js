const mongoose = require('mongoose');

// Define the Service schema
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Service name
    description: { type: String, required: true }, // Service description
    category: { type: String, required: true }, // Service category
    price: { type: Number, required: true }, // Price of the service
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
