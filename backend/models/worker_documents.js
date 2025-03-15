const mongoose = require('mongoose');

// Define the WorkerDocument schema
const workerDocumentSchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true }, // Reference to Worker model
    aadhaar: { type: String, required: true }, // Aadhaar number
    license: { type: String, required: true }, // License number
    shopDetails: { type: String, required: true }, // Shop details (could be text or JSON)
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const WorkerDocument = mongoose.model('WorkerDocument', workerDocumentSchema);

module.exports = WorkerDocument;
