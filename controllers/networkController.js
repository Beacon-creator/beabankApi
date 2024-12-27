const express = require("express");
const os = require("os");
const router = express.Router();

// Function to calculate network strength
const getNetworkStrength = () => {
  const networkInterfaces = os.networkInterfaces();
  const strengths = [];

  Object.keys(networkInterfaces).forEach((key) => {
    networkInterfaces[key].forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) {
        strengths.push(Math.random() * 100); // Mock strength percentage
      }
    });
  });

  return strengths.length ? Math.max(...strengths) : 0;
};

module.exports = {getNetworkStrength}
