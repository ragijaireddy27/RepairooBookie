const express = require('express');
const bcrypt = require('bcrypt');
const Worker = require('../models/Worker'); // Updated path to Mongoose Worker model
const router = express.Router();

// POST /api/register/worker
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address, role, serviceTypes, aadhaarProof, shopDetails, license } = req.body;

  try {
    // 1. Validate input
    if (!name || !email || !password || !phone || !address || !serviceTypes || !aadhaarProof || !shopDetails || !license) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if email already exists
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new worker in the database
    const newWorker = await Worker.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address, // Assuming 'address' is a plain object or JSON object
      role: role || 'worker', // Default role as 'worker'
      serviceTypes, // Field name as defined in your Mongoose schema (e.g., an array of strings)
      aadhaarProof, // Storing Aadhaar proof as a string (URL, file name, etc.)
      shopDetails, // Shop details as a string or JSON object
      license,     // License information
    });

    // 5. Remove sensitive data (like password) before returning user data
    const workerData = newWorker.toObject();
    delete workerData.password;

    // 6. Send success response with worker data (excluding sensitive data)
    return res.status(201).json({ message: "Worker registered successfully!", worker: workerData });
  } catch (error) {
    console.error("Error during worker registration:", error);
    return res.status(500).json({ message: "Failed to register worker. Please try again." });
  }
});

module.exports = router;
