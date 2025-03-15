const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Adjust this path based on your file structure
const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  try {
    // 1. Validate input (Optional: you can add further validation here)
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    // 4. Create new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address, // Assuming 'address' is a JSON object
      role: role || 'user', // Default role as 'user'
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 5. Remove sensitive data (like password) from response
    const { password: _, ...userData } = newUser.dataValues;

    // 6. Send success response with user data (excluding sensitive data)
    return res.status(201).json({ message: "User registered successfully!", user: userData });
  } catch (error) {
    console.error("Error during registration:", error);
    // Sending specific error message for better debugging
    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({ message: "Database error during registration." });
    }
    return res.status(500).json({ message: "Failed to register user. Please try again." });
  }
});

module.exports = router;
