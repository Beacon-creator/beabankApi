const Balance = require("../models/balanceModel");

// Controller for fetching the user's balance and timer
const getBalance = async (req, res) => {
  const { userId } = req.params;

  try {
    let user = await Balance.findOne({ userId });

    if (!user) {
      // Initialize user data if not found
      user = new Balance({ userId });
      await user.save();
    }

    // Calculate elapsed time since the last update
    const now = new Date();
    const elapsedSeconds = Math.floor((now - user.lastUpdated) / 1000);

    // Update balance and timer
    const increments = Math.min(elapsedSeconds, user.timer) * 0.0001;
    user.balance += increments;
    user.timer = Math.max(user.timer - elapsedSeconds, 0);

    if (user.timer === 0) {
      user.timer = 86400; // Reset timer if elapsed
    }

    user.lastUpdated = now;
    await user.save();

    res.status(200).json({ balance: user.balance, timer: user.timer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
};

// Controller for updating the user's balance manually
const updateBalance = async (req, res) => {
  const { userId, increment } = req.body;

  if (typeof increment !== "number" || increment <= 0) {
    return res.status(400).json({ error: "Invalid increment value" });
  }

  try {
    const user = await Balance.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.balance += increment;
    user.lastUpdated = new Date();
    await user.save();

    res.status(200).json({ balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update balance" });
  }
};

// Controller for updating the user's timer
const updateProgress = async (req, res) => {
  const { userId, timer } = req.body;

  try {
    const user = await Balance.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.timer = timer;
    user.lastUpdated = new Date();
    await user.save();

    res.status(200).json({ timer: user.timer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

module.exports = {
  getBalance,
  updateBalance,
  updateProgress,
};
