const mongoose = require('mongoose');

// Define the WorkerJob schema
const workerJobSchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true }, // Reference to Worker model
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Reference to Booking model
    jobStatus: { type: String, required: true }, // Job status (e.g., in-progress, completed)
    jobStartTime: { type: Date, required: true }, // Job start time
    jobEndTime: { type: Date, default: null }, // Job end time, default is null if not yet completed
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const WorkerJob = mongoose.model('WorkerJob', workerJobSchema);

module.exports = WorkerJob;
