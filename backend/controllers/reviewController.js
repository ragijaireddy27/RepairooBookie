const { Review } = require('../models');

const createReview = async (req, res) => {
    const { userId, serviceId, rating, review } = req.body;

    try {
        const newReview = await Review.create({
            user_id: userId, service_id: serviceId, rating, review
        });

        res.status(201).json({ message: "Review created successfully", review: newReview });
    } catch (error) {
        res.status(500).json({ message: "Server error during review creation" });
    }
};

const getServiceReviews = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const reviews = await Review.findAll({ where: { service_id: serviceId } });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching reviews" });
    }
};

module.exports = { createReview, getServiceReviews };
