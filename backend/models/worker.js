const mongoose = require('mongoose');

// Define the Worker schema
const workerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    serviceTypes: { type: [String], required: true }, // Array of service types (as strings)
    aadhaar: { type: String, required: true }, // Aadhaar number
    license: { type: String, required: true }, // License number
    shopDetails: { type: String, required: true }, // Shop details (could be a string or JSON)
    address: { type: Object, required: true }, // Address stored as an object (could also be a nested schema)
    ratingsAvg: { type: Number, default: 0 }, // Average rating, default is 0
    experience: { type: Number, default: 0 }, // Years of experience
    status: { type: String, default: 'active' }, // Worker status (e.g., active, inactive)
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
