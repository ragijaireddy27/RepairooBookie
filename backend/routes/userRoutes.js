const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../models/User"); // Import your Mongoose User model
const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  try {
    // Validate input
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address, // Assumes address is a JSON object or plain object
      role: role || 'user', // Default role as 'user'
    });

    // Remove sensitive data (like password) from response
    const { password: removed, ...userData } = newUser.toObject();

    // Send success response with user data (excluding sensitive data)
    return res.status(201).json({ message: "User registered successfully!", user: userData });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Failed to register user. Please try again." });
  }
});

module.exports = router;
