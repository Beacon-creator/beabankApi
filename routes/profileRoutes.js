const express = require("express");
const {
  upload,
  uploadProfilePic,
} = require("../controllers/profileController");
const { authenticateUser } = require("../controllers/authController");

const router = express.Router();

// Upload profile picture route
router.post(
  "/auth/upload-profile-pic",
  authenticateUser, // Ensure user is authenticated
  upload.single("profilePic"), // Use multer middleware for file uploads
  uploadProfilePic
);

module.exports = router;
