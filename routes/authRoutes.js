const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  fetchUserData,
} = require("../controllers/authController");

// Route to fetch user data, ensuring the user is authenticated
router.get("/auth/user-data", authenticateUser, fetchUserData);

module.exports = router;
