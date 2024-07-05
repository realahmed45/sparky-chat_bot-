const express = require("express");
const {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
} = require("../contollers/usersController");
const isAuthenticated = require("../MIDDLEWARE/isAuthenticated");
const User = require("../models/User"); // Import User model
const ContentHistory = require("../models/ContentHistory"); // Import ContentHistory model

const usersRouter = express.Router();

// Register route
usersRouter.post("/register", register);

// Login route
usersRouter.post("/login", login);

// Logout route
usersRouter.post("/logout", logout);

// User profile route (protected by isAuthenticated middleware)
usersRouter.get("/profile", isAuthenticated, async (req, res) => {
  try {
    // Assuming userId is available in req.user.id after authentication
    const userId = req.user.id;

    // Find user by ID and populate contentHistory
    const user = await User.findById(userId).populate("contentHistory");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user profile with populated contentHistory
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Check authentication route (protected by isAuthenticated middleware)
usersRouter.get("/auth/check", isAuthenticated, checkAuth);

module.exports = usersRouter;
