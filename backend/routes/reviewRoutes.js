const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Add a review for a service
router.post("/", async (req, res) => {
  const { userId, serviceId, rating, review } = req.body;

  try {
    const newReview = await pool.query(
      `INSERT INTO reviews (user_id, service_id, rating, review) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, serviceId, rating, review]
    );

    res.status(201).json({ message: "Review added", review: newReview.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get reviews for a specific service
router.get("/:serviceId", async (req, res) => {
  const { serviceId } = req.params;

  try {
    const reviews = await pool.query("SELECT * FROM reviews WHERE service_id = $1", [serviceId]);
    res.json(reviews.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
