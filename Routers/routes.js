const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel.js");
const aunthenticateUser = require('../Middleware/authMiddleware.js')
require("dotenv").config();

const router = express.Router();

// Helper function to lock user account
const lockUser = async (user) => {
  user.locked = true;
  user.unlockTime = new Date(
    Date.now() + process.env.ACCOUNT_UNLOCK_TIME * 60 * 1000
  );
  await user.save();
};

// API 1: User Registration
router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber, country } = req.body;

  if (!name || !email || !password || !phoneNumber || !country)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      country,
    });
    await user.save();
  return  res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
   return res.status(500).json({ error: "Internal server error" });
  }
});

/// API 2: User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Handle account lock logic
      if (user.locked) {
        const isUnlockTimeReached = user.unlockTime && new Date() > user.unlockTime;
  
        if (isUnlockTimeReached) {
          // Unlock the account if the unlock time has passed
          user.locked = false;
          user.loginAttempts = 0;
          user.unlockTime = null;
          await user.save();
        } else {
          return res
            .status(403)
            .json({ error: "Account is locked. Try again later." });
        }
      }
  
      // Verify the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Increment login attempts and lock account if necessary
        user.loginAttempts += 1;
        if (user.loginAttempts >= 3) {
          await lockUser(user);
          return res.status(403).json({
            error: "Account is locked due to multiple failed attempts",
          });
        }
        await user.save();
        return res.status(401).json({
          error: "Invalid credentials",
          remainingAttempts: 3 - user.loginAttempts,
        });
      }
  
      // Successful login
      user.loginAttempts = 0;
      user.locked = false;
      user.unlockTime = null;
      await user.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  
// API 3: Get User Profile
router.get("/profile", aunthenticateUser, async (req, res) => {
  try {
    // Extract user from the request object
    const { name, email, phoneNumber, country } = req.user;

    // Return the user
  return  res.status(200).json({
      name,
      email,
      phoneNumber,
      country,
    });
  } catch (error) {
   console.log(error)
   return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
