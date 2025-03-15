const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { body, validationResult } = require('express-validator');

const router = express.Router();

// User Registration
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").isNumeric().withMessage("Phone number should contain only numbers"),
    body("name").not().isEmpty().withMessage("Name is required"),
    body("address").not().isEmpty().withMessage("Address is required"),
    body("role").not().isEmpty().withMessage("Role is required"),
    body("serviceType").not().isEmpty().withMessage("Service type is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address, pincode, password, role, serviceType, aadhar, shopDetails, license } = req.body;

    try {
      const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (checkUser.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await pool.query(
        `INSERT INTO users (name, email, phone, address, pincode, password, role, service_type, aadhar, shop_details, license)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [name, email, phone, address, pincode, hashedPassword, role, serviceType, aadhar, shopDetails, license]
      );

      res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// User Login
router.post("/login/user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.rows[0].role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
