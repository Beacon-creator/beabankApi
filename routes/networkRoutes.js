const express = require("express");
const { getNetworkStrength } = require("../controllers/networkController");

const router = express.Router();

router.get("/api/network-strength", (req, res) => {
  try {
    const strength = getNetworkStrength();
    res.json({ strength });
  } catch (error) {
    console.error("Error fetching network strength:", error);
    res.status(500).json({ error: "Failed to retrieve network strength" });
  }
});

module.exports = router;
