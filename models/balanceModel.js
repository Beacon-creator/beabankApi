const mongoose = require("mongoose");
const TIMER_RESET = 86400; // 24 hours in seconds
// User Schema
const BalanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  timer: { type: Number, default: TIMER_RESET },
  lastUpdated: { type: Date, default: Date.now },
  totalEarned: { type: Number, default: 0 }
});
// Create the User model
const Balance = mongoose.model("Balance", BalanceSchema);

module.exports = Balance;
