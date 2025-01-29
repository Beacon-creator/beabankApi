const express = require("express");
const si = require("systeminformation");

const getNetworkStrength = async () => {
  try {
    const networkData = await si.networkInterfaces();
    const wifiInfo = await si.wifiNetworks();

    // First try to find wireless connection
    const wireless = networkData.find(
      iface => iface.operstate === "up" && iface.type === "wireless"
    );

    if (wireless && wifiInfo.length > 0) {
      const activeWifi = wifiInfo[0]; // Get first wireless network
      const signalLevel = activeWifi.signalLevel || -50;
      const signalPercentage = Math.max(0, Math.min(100, 2 * (signalLevel + 100)));

      return {
        ssid: activeWifi.ssid,
        strength: signalPercentage,
        details: {
          interface: wireless.iface,
          type: "wireless"
        }
      };
    }

    // Fallback to any active connection
    const active = networkData.find(net => net.operstate === "up");
    return {
      ssid: active?.iface || "Unknown",
      strength: active ? 100 : 0,
      details: {
        interface: active?.iface,
        type: active?.type || "unknown"
      }
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = { getNetworkStrength };