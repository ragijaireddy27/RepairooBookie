const bcrypt = require("bcrypt");
const { User } = require('../models'); // Assuming 'User' is the Mongoose model

// Get user profile
const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in the JWT payload

    try {
        const userProfile = await User.findById(userId, 'id name email phone address pincode role'); // Mongoose find by ID, returning specific fields

        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ profile: userProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user profile", error });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email, phone, address, pincode } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { name, email, phone, address, pincode },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user profile", error });
    }
};

// Change user password
const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId); // Find user by ID

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password); // Compare passwords
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

        user.password = hashedNewPassword; // Update the password
        await user.save(); // Save the updated user document

        res.status(200).json({ message: "Password updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error changing password", error });
    }
};

module.exports = { getUserProfile, updateUserProfile, changePassword };
