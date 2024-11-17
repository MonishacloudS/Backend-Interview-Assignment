const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");

router.post("/unlock-user", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.locked = false;
    user.loginAttempts = 0;
    user.unlockTime = null;
    await user.save();

    res.status(200).json({ message: "User account unlocked successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
