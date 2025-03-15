const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // User's name
    email: { type: String, required: true, unique: true }, // User's email (unique)
    password: { type: String, required: true }, // User's password
    phone: { type: String, required: true }, // User's phone number
    address: { type: mongoose.Schema.Types.Mixed, required: true }, // User's address (can be any type, similar to JSONB)
    role: { type: String, default: 'user' }, // User's role, default to 'user'
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
