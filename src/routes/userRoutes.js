const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authenticateToken } = require("../middleware/auth");
const { validateRegistration, validateLogin } = require("../middleware/validateRequest");

// Public routes
router.post("/register", validateRegistration, UserController.registerUser);
router.post("/login", validateLogin, UserController.loginUser);

// Protected routes
router.get("/profile", authenticateToken, UserController.getUserProfile);

module.exports = router;