const Balance = require("../models/balanceModel.js");

const TIMER_RESET = 86400; // 24 hours in seconds
const INCREMENT_RATE = 0.0001;
const MAX_BALANCE = 1000000;

// Utility function to format seconds into HH:MM:SS
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const pad = (num) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};

// Rest of your existing calculateProgress function...
const calculateProgress = (user) => {
  const now = new Date();
  const lastUpdate = new Date(user.lastUpdated);
  const elapsedSeconds = Math.floor((now - lastUpdate) / 1000);

  if (elapsedSeconds <= 0) return user;

  const completedCycles = Math.floor(elapsedSeconds / TIMER_RESET);
  const remainingSeconds = elapsedSeconds % TIMER_RESET;

  let newTimer;
  if (user.timer > remainingSeconds) {
    newTimer = user.timer - remainingSeconds;
  } else {
    const extraCycles = Math.floor((remainingSeconds - user.timer) / TIMER_RESET);
    newTimer = TIMER_RESET - ((remainingSeconds - user.timer) % TIMER_RESET);
  }

  const totalActiveSeconds = (completedCycles * TIMER_RESET) + 
    (user.timer < remainingSeconds ? user.timer : remainingSeconds);
  const balanceIncrement = totalActiveSeconds * INCREMENT_RATE;

  user.balance = Math.min(user.balance + balanceIncrement, MAX_BALANCE);
  user.timer = newTimer;
  user.lastUpdated = now;
  user.totalEarned = (user.totalEarned || 0) + balanceIncrement;

  return user;
};

const getBalance = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    let user = await Balance.findOne({ userId });

    if (!user) {
      user = new Balance({
        userId,
        balance: 0,
        timer: TIMER_RESET,
        lastUpdated: new Date(),
        totalEarned: 0
      });
    } else {
      user = calculateProgress(user);
    }

    await user.save();

    // Return formatted time along with other data
    res.status(200).json({
      balance: parseFloat(user.balance.toFixed(4)),
      timer: user.timer,
      timerFormatted: formatTime(user.timer), // Add formatted time
      lastUpdated: user.lastUpdated,
      totalEarned: parseFloat(user.totalEarned.toFixed(4))
    });

  } catch (err) {
    console.error("Error fetching user balance:", err);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
};

const updateBalance = async (req, res) => {
  const { userId, timer, increment } = req.body;

  // if (!userId || typeof increment !== "number" || increment <= 0) {
  //   return res.status(400).json({ error: "Invalid userId or increment value" });
  // }

  if (!userId || typeof timer !== "number" || timer < 0 || timer > TIMER_RESET) {
    return res.status(400).json({ 
      error: "Invalid userId or timer value",
      maxTimer: TIMER_RESET
    });
  }

  try {
    let user = await Balance.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // First update based on elapsed time
    user = calculateProgress(user);
    
    user.timer = timer;
    user.balance = Math.min(user.balance + increment, MAX_BALANCE);
    user.totalEarned = (user.totalEarned || 0) + increment;
    
    await user.save();

    res.status(200).json({

      timer: user.timer,
      timerFormatted: formatTime(user.timer),
      balance: parseFloat(user.balance.toFixed(4)),
      totalEarned: parseFloat(user.totalEarned.toFixed(4))
    });

  } catch (err) {
    console.error("Error updating balance:", err);
    res.status(500).json({ error: "Failed to update balance" });
  }
};


// Updating the other controller functions to include formatted time...
const updateProgress = async (req, res) => {
  const { userId, timer } = req.body;

  if (!userId || typeof timer !== "number" || timer < 0 || timer > TIMER_RESET) {
    return res.status(400).json({ 
      error: "Invalid userId or timer value",
      maxTimer: TIMER_RESET
    });
  }

  try {
    let user = await Balance.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user = calculateProgress(user);
    user.timer = timer;
    await user.save();

    res.status(200).json({
      timer: user.timer,
      timerFormatted: formatTime(user.timer), // Add formatted time
      balance: parseFloat(user.balance.toFixed(4))
    });

  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

module.exports = {
  getBalance,
  updateBalance,
  updateProgress,
};