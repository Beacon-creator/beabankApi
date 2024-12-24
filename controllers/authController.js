const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

// Middleware to check for JWT and get user data
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // JWT from the cookie
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach user data to the request object
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to authenticate" });
  }
};

// Route to fetch user data
const fetchUserData = async (req, res) => {
  const user = req.user; // User from the authenticateUser middleware
  return res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
  });
};

module.exports = { 
  authenticateUser, 
  fetchUserData 
};
