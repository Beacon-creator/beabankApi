const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const signinHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Invalid email or password." }] });
    }

    console.log("User found:", user);

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Invalid email or password." }] });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.LOGIN_EXPIRES,
    });

    // Set token as an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Signin successful.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Error signing in user:", err.message);
    return res.status(500).json({
      errors: [{ msg: "Internal server error. Please try again later." }],
    });
  }
};

module.exports = { signinHandler };
