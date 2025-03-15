const mongoose = require('mongoose');

// Define the WorkerAvailability schema
const workerAvailabilitySchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true }, // Reference to Worker model
    availableFrom: { type: Date, required: true }, // Worker available from this time
    availableTo: { type: Date, required: true }, // Worker available until this time
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const WorkerAvailability = mongoose.model('WorkerAvailability', workerAvailabilitySchema);

module.exports = WorkerAvailability;
