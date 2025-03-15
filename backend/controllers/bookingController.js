const pool = require("../config/db");

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
        // Insert booking into the database
        const newBooking = await pool.query(
            "INSERT INTO bookings (user_id, service_type, address, pincode, worker_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userId, serviceType, address, pincode, workerId, status]
        );

        res.status(201).json({ message: "Booking created successfully", booking: newBooking.rows[0] });
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
        // Update the booking status in the database
        const updatedBooking = await pool.query(
            "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
            [status, bookingId]
        );

        if (updatedBooking.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking status updated", booking: updatedBooking.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating booking status", error });
    }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all bookings for the user from the database
        const userBookings = await pool.query(
            "SELECT * FROM bookings WHERE user_id = $1",
            [userId]
        );

        if (userBookings.rows.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.status(200).json({ bookings: userBookings.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user bookings", error });
    }
};

// Get all bookings for a worker
const getWorkerBookings = async (req, res) => {
    const { workerId } = req.params;

    try {
        // Fetch all bookings assigned to the worker
        const workerBookings = await pool.query(
            "SELECT * FROM bookings WHERE worker_id = $1",
            [workerId]
        );

        if (workerBookings.rows.length === 0) {
            return res.status(404).json({ message: "No bookings found for this worker" });
        }

        res.status(200).json({ bookings: workerBookings.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching worker bookings", error });
    }
};

module.exports = { createBooking, updateBookingStatus, getUserBookings, getWorkerBookings };
