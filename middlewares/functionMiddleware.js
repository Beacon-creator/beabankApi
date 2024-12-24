const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const expirein = process.env.LOGIN_EXPIRES;
const { User } = require("../models/userModel");

// Ensure jwtSecret has a value
if (!jwtSecret) {
  console.error("JWT_SECRET is not defined in environment variables.");
  process.exit(1); // Exit the process or handle the error accordingly
}

// Function to generate a JWT token in signup
const generateToken = async (_id) => {
  try {
    // Fetch the user data from the database using the userId
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    // Get the JWT token using the user's ID and JWT secret
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: expirein,
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};


// Middleware to verify JWT token in signin
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt; // Assume token is stored in cookies

  if (!token) {
    return res.status(401).json({ errors: [{ msg: "Unauthorized access" }] });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Add decoded user data to request object
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);
    return res.status(403).json({ errors: [{ msg: "Invalid or expired token" }] });
  }
};


// Export the router and the generateToken function separately
module.exports = {
  router,
  generateToken,
  verifyToken
};
