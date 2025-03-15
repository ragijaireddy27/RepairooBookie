const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Mongoose User model
const Worker = require("../models/Worker"); // Mongoose Worker model
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
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) return res.status(400).json({ message: "User already exists with this email or phone number." });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user in MongoDB
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            pincode,
            role: "user",
        });

        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id, "user");

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
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT token
        const token = generateToken(user._id, "user");

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
        const existingWorker = await Worker.findOne({ $or: [{ email }, { phone }] });
        if (existingWorker) return res.status(400).json({ message: "Worker already exists with this email or phone number." });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new worker in MongoDB
        const newWorker = new Worker({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            pincode,
            service_type,
            aadhaar_proof,
            shop_details,
            shop_license,
        });

        await newWorker.save();

        // Generate JWT token
        const token = generateToken(newWorker._id, "worker");

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
        const worker = await Worker.findOne({ email });
        if (!worker) return res.status(400).json({ message: "Invalid email or password" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, worker.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT token
        const token = generateToken(worker._id, "worker");

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

module.exports = { registerUser, loginUser, registerWorker, loginWorker };
