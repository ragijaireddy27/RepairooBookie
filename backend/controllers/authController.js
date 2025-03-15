const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Helper function for generating JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// User Registration
const registerUser = async (req, res) => {
    const { name, email, phone, password, address, pincode } = req.body;

    try {
        // Check if user exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1 OR phone = $2", [email, phone]);
        if (existingUser.rows.length > 0) return res.status(400).json({ message: "User already exists with this email or phone number." });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, phone, password, address, pincode, role) VALUES ($1, $2, $3, $4, $5, $6, 'user') RETURNING *",
            [name, email, phone, hashedPassword, address, pincode]
        );

        // Generate JWT token
        const token = generateToken(newUser.rows[0].id, "user");

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

// User Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(400).json({ message: "Invalid email or password" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT token
        const token = generateToken(user.rows[0].id, "user");

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

// Worker Registration
const registerWorker = async (req, res) => {
    const { name, email, phone, password, address, pincode, service_type, aadhaar_proof, shop_details, shop_license } = req.body;

    try {
        // Check if worker exists
        const existingWorker = await pool.query("SELECT * FROM workers WHERE email = $1 OR phone = $2", [email, phone]);
        if (existingWorker.rows.length > 0) return res.status(400).json({ message: "Worker already exists with this email or phone number." });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert worker into database
        const newWorker = await pool.query(
            "INSERT INTO workers (name, email, phone, password, address, pincode, service_type, aadhaar_proof, shop_details, shop_license) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [name, email, phone, hashedPassword, address, pincode, service_type, aadhaar_proof, shop_details, shop_license]
        );

        // Generate JWT token
        const token = generateToken(newWorker.rows[0].id, "worker");

        res.status(201).json({ message: "Worker registered successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

// Worker Login
const loginWorker = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if worker exists
        const worker = await pool.query("SELECT * FROM workers WHERE email = $1", [email]);
        if (worker.rows.length === 0) return res.status(400).json({ message: "Invalid email or password" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, worker.rows[0].password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT token
        const token = generateToken(worker.rows[0].id, "worker");

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

module.exports = { registerUser, loginUser, registerWorker, loginWorker };
