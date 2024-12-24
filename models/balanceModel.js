const mongoose = require("mongoose");

// User Schema
const BalanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0.0 },
  lastUpdated: { type: Date, default: Date.now },
  timer: { type: Number, default: 86400 }, // Timer in seconds (24 minutes)
});

// Create the User model
const Balance = mongoose.model("Balance", BalanceSchema);

module.exports = Balance;
