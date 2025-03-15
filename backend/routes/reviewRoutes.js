const express = require("express");
const Review = require("../models/Review"); // Mongoose model for Review

const router = express.Router();

// Add a review for a service
router.post("/", async (req, res) => {
  const { userId, serviceId, rating, review } = req.body;

  try {
    // Check if rating is within valid range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const newReview = await Review.create({
      userId,
      serviceId,
      rating,
      review,
    });

    res.status(201).json({ message: "Review added", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get reviews for a specific service
router.get("/:serviceId", async (req, res) => {
  const { serviceId } = req.params;

  try {
    const reviews = await Review.find({ serviceId });

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this service" });
    }

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
