const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Get user profile
const getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const userProfile = await pool.query(
            "SELECT id, name, email, phone, address, pincode, role FROM users WHERE id = $1", 
            [userId]
        );

        if (userProfile.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ profile: userProfile.rows[0] });
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
        const updatedUser = await pool.query(
            "UPDATE users SET name = $1, email = $2, phone = $3, address = $4, pincode = $5 WHERE id = $6 RETURNING *",
            [name, email, phone, address, pincode, userId]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser.rows[0] });
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
        const user = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const updatedPassword = await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
            [hashedNewPassword, userId]
        );

        res.status(200).json({ message: "Password updated successfully", user: updatedPassword.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error changing password", error });
    }
};

module.exports = { getUserProfile, updateUserProfile, changePassword };
