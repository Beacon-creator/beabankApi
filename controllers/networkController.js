const express = require("express");
const si = require("systeminformation");

const getNetworkStrength = async () => {
  try {
    const networkData = await si.networkInterfaces();
    const activeInterfaces = networkData.filter(
      (iface) => iface.operstate === "up" && iface.type === "wireless"
    );

    if (activeInterfaces.length > 0) {
      const wifiInfo = await si.wifiNetworks();
      console.log("WiFi Networks Info:", wifiInfo);

      // Match active Wi-Fi network
      const activeWifi = wifiInfo.find((wifi) =>
        activeInterfaces.some((iface) => iface.iface === "Wi-Fi" && wifi.ssid)
      );

      if (activeWifi) {
        // Convert signal level to percentage
        const signalLevel = activeWifi.signalLevel;
        const signalPercentage = Math.max(0, Math.min(100, 2 * (signalLevel + 100)));

        // Return only SSID and signal strength
        return { ssid: activeWifi.ssid, strength: signalPercentage };
      }

      return { ssid: "Unknown", strength: null }; // Handle cases without SSID or strength
    } else {
      return { ssid: "No active network", strength: null }; // No active interfaces
    }
  } catch (error) {
    console.error("Error fetching network strength:", error);
    throw new Error("Failed to fetch network strength.");
  }
};

module.exports = { getNetworkStrength };
