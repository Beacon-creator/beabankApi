const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcrypt");
const emailjs = require("@emailjs/nodejs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/userModel.js"); // Adjust the path to your user model
const { OTPVerification } = require("../../models/otpVerificationModel.js"); // Adjust the path to your OTP model

// Function to handle user signup
const signupUserHandler = async (req, res) => {
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
      return res
        .status(400)
        .json({ errors: [{ msg: "Email already in use" }] });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const hashedOTP = await bcrypt.hash(otp.toString(), 10);

    // Create a new user
    const newUser = new User({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      verified: false,
    });

    const savedUser = await newUser.save();

    // Save OTP for verification
    const newOTPVerification = new OTPVerification({
      userId: savedUser._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour expiration
    });

    await newOTPVerification.save();

    // Send OTP to user's email
    await sendOTPVerificationEmail(savedUser.email, otp);

    // Generate JWT token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Send success response
    res.status(201).json({
      message: "User signed up successfully. Please verify your email.",
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("Error signing up user:", err);
    res.status(500).json({ errors: [{ msg: "Internal server error" }] });
  }
};

// Function to send OTP verification email
const sendOTPVerificationEmail = async (email, otp) => {
  try {
    const emailData = {
      subject: "Email Verification",
      to: email,
      message: `Your verification code is: ${otp}. This code expires in 1 hour.`,
    };

    const emailResponse = await emailjs.send(
      process.env.SERVICE_ID,
      process.env.TEMPLATE_ID,
      emailData,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // optional for added security
      }
    );

    console.log(
      "Email sent successfully!",
      emailResponse.status,
      emailResponse.text
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { signupUserHandler };
