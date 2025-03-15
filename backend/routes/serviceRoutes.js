const express = require("express");
const Service = require("../models/Service"); // Import the Mongoose Service model

const router = express.Router();

// Get all services
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;  // Default to page 1 and limit 10 services
  try {
    const services = await Service.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new service
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Service name is required"),
    body("category").not().isEmpty().withMessage("Category is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, price } = req.body;

    try {
      const newService = await Service.create({ name, description, category, price });
      res.status(201).json({ message: "Service added", service: newService });
    } catch (error) {
      console.error("Error adding service:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
