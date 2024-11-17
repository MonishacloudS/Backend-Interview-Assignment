const jwt = require('jsonwebtoken');
const User = require('../Models/userModel.js');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || !token.startsWith('Bearer')) return res.status(401).json({ error: 'Unauthorized: Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //fetch user from the database
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    //check if account is locked
    if (user.locked) return res.status(403).json({ error: 'Account is locked' });
//attach user to request object fro use in the handler
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
