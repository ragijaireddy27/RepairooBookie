const { Review } = require('../models'); // Assuming 'Review' is the Mongoose model

// Create a new review
const createReview = async (req, res) => {
    const { userId, serviceId, rating, review } = req.body;

    try {
        // Create a new review document in MongoDB
        const newReview = new Review({
            userId, 
            serviceId, 
            rating, 
            review
        });

        // Save the review to the database
        const savedReview = await newReview.save();

        res.status(201).json({ message: "Review created successfully", review: savedReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during review creation" });
    }
};

// Get all reviews for a service
const getServiceReviews = async (req, res) => {
    const { serviceId } = req.params;

    try {
        // Fetch all reviews for the given serviceId from MongoDB
        const reviews = await Review.find({ serviceId });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this service" });
        }

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching reviews" });
    }
};

module.exports = { createReview, getServiceReviews };
