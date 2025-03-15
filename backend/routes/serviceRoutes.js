const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await pool.query("SELECT * FROM services");
    res.json(services.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new service
router.post("/", async (req, res) => {
  const { name, description, category, price } = req.body;

  try {
    const newService = await pool.query(
      `INSERT INTO services (name, description, category, price) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, category, price]
    );

    res.status(201).json({ message: "Service added", service: newService.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
