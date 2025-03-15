const Booking = require("../models/Booking"); // Mongoose Booking model
const { validationResult } = require("express-validator");

// Validate booking inputs
const validateBookingInputs = ({ userId, serviceType, address, pincode, workerId, status }) => {
    if (!userId || !serviceType || !address || !pincode || !workerId || !status) {
        return "All fields are required";
    }
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
        return "Invalid status. Valid statuses are 'pending', 'in-progress', 'completed'.";
    }
    return null;
};

// Create a new booking (User booking a service)
const createBooking = async (req, res) => {
    const { userId, serviceType, address, pincode, workerId, status } = req.body;

    // Validate inputs
    const validationError = validateBookingInputs({ userId, serviceType, address, pincode, workerId, status });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        // Create a new booking in MongoDB
        const newBooking = new Booking({
            userId,
            serviceType,
            address,
            pincode,
            workerId,
            status,
        });

        // Save the booking to MongoDB
        const savedBooking = await newBooking.save();

        res.status(201).json({ message: "Booking created successfully", booking: savedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating booking", error });
    }
};

// Update booking status (Worker accepting or completing a job)
const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status. Valid statuses are 'pending', 'in-progress', 'completed'." });
    }

    try {
        // Update the booking status in MongoDB
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true } // This ensures the updated document is returned
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking status updated", booking: updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating booking status", error });
    }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all bookings for the user from MongoDB
        const userBookings = await Booking.find({ userId });

        if (userBookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.status(200).json({ bookings: userBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user bookings", error });
    }
};

// Get all bookings for a worker
const getWorkerBookings = async (req, res) => {
    const { workerId } = req.params;

    try {
        // Fetch all bookings assigned to the worker from MongoDB
        const workerBookings = await Booking.find({ workerId });

        if (workerBookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this worker" });
        }

        res.status(200).json({ bookings: workerBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching worker bookings", error });
    }
};

module.exports = { createBooking, updateBookingStatus, getUserBookings, getWorkerBookings };
