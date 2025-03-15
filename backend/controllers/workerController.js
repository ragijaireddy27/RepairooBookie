const bcrypt = require('bcrypt');
const { Worker } = require('../models'); // Assuming 'Worker' is the Mongoose model

// Register a new worker
const registerWorker = async (req, res) => {
  const { name, email, password, phone, address, role, serviceTypes, aadhaarProof, shopDetails, license } = req.body;

  try {
    if (!name || !email || !password || !phone || !address || !serviceTypes || !aadhaarProof || !shopDetails || !license) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newWorker = new Worker({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role || 'worker',
      service_types: serviceTypes,
      aadhaar_proof: aadhaarProof,
      shop_details: shopDetails,
      license,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newWorker.save(); // Save the new worker to the database

    return res.status(201).json({ message: "Worker registered successfully!" });
  } catch (error) {
    console.error("Error during worker registration:", error);
    return res.status(500).json({ message: "Failed to register worker. Please try again." });
  }
};

// Get worker profile
const getWorkerProfile = async (req, res) => {
  const workerId = req.worker.id;

  try {
    const workerProfile = await Worker.findById(workerId);

    if (!workerProfile) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ profile: workerProfile });
  } catch (error) {
    console.error("Error fetching worker profile:", error);
    res.status(500).json({ message: "Error fetching worker profile" });
  }
};

// Update worker profile
const updateWorkerProfile = async (req, res) => {
  const workerId = req.worker.id;
  const { name, email, phone, address, serviceTypes, aadhaarProof, shopDetails, license } = req.body;

  try {
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.name = name || worker.name;
    worker.email = email || worker.email;
    worker.phone = phone || worker.phone;
    worker.address = address || worker.address;
    worker.service_types = serviceTypes || worker.service_types;
    worker.aadhaar_proof = aadhaarProof || worker.aadhaar_proof;
    worker.shop_details = shopDetails || worker.shop_details;
    worker.license = license || worker.license;
    worker.updated_at = new Date();

    await worker.save();

    res.status(200).json({ message: "Worker profile updated successfully", profile: worker });
  } catch (error) {
    console.error("Error updating worker profile:", error);
    res.status(500).json({ message: "Error updating worker profile" });
  }
};

// Change worker password
const changeWorkerPassword = async (req, res) => {
  const workerId = req.worker.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, worker.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    worker.password = hashedNewPassword;
    worker.updated_at = new Date();

    await worker.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing worker password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};

module.exports = {
  registerWorker,
  getWorkerProfile,
  updateWorkerProfile,
  changeWorkerPassword,
};
