const express = require("express");
const {
  getBalance,
  updateBalance,
  startMining,
  updateProgress,
} = require("../controllers/balanceController.js");

const router = express.Router();

// GET /api/balance/:userId - Fetch user balance and timer
router.get("/api/balance/:userId", getBalance);

// POST /api/update-balance - Increment user balance manually
router.post("/api/update-balance", updateBalance);

// routes/start-mining
router.post("/api/start-mining", startMining);

// PUT /api/progress - Update user timer and progress
router.put("/api/progress", updateProgress);

module.exports = router;
