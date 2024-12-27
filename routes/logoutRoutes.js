const express = require("express");
const { logoutHandler } = require("../controllers/logoutController");

const router = express.Router();

// Logout route
router.post("/auth/logout", logoutHandler);

module.exports = router;
