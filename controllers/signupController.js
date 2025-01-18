const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel.js");
const { generateToken } = require("../middlewares/functionMiddleware.js");

// Function to handle user signup
const signupHandler = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const data = matchedData(req);

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({
        errors: [{ msg: "Email already in use" }],
      });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log("Hashed password at signup:", hashedPassword);

    // Create a new user object
    const newUser = new User({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = await generateToken(savedUser._id);

    // Set token as an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: process.env.NODE_ENV === "production", // Secure flag in production
      sameSite: "strict", // Prevent CSRF attacks
    });

    // Send success response
    return res.status(201).json({
      message: "User signed up successfully.",
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error("Error signing up user:", err.message);
    return res.status(500).json({
      errors: [{ msg: "Internal server error. Please try again later." }],
    });
  }
};

module.exports = { signupHandler };
