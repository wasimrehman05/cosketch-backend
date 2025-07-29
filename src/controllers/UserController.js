const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        const user = await User.register(name, email, password);
        res.status(201).json({
            message: "User registered successfully",
            user: user.userDetails()
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message, errors: error.details || undefined });
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body || {};
    try {
        const user = await User.login(email, password);
        const token = jwt.sign(user.userDetails(), process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({
            message: "User logged in successfully",
            accessToken: token
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message, errors: error.details || undefined });
    }
}

module.exports = { registerUser, loginUser };