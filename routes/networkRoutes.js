const express = require("express");
const { getNetworkStrength } = require("../controllers/networkController");

const router = express.Router();

router.get("/api/network-strength", async (req, res) => {
  res.set("Cache-Control", "no-cache");
  res.removeHeader("ETag");
  try {
    const strength = await getNetworkStrength();
    res.status(200).json({ strength });
  } catch (error) {
    console.error("Error fetching network strength:", error);
    res.status(500).json({ error: "Failed to fetch network strength" });
  }
});



module.exports = router;
