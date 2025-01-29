const express = require("express");
const si = require("systeminformation");

const getNetworkStrength = async () => {
  try {
    const networkData = await si.networkInterfaces();
    
    // Look for any active wireless interface
    const activeInterfaces = networkData.filter(
      (iface) => iface.operstate === "up" && 
      (iface.type === "wireless" || iface.type.includes("wifi") || iface.type.includes("wlan"))
    );

    if (activeInterfaces.length > 0) {
      const wifiInfo = await si.wifiNetworks();
      
      // Find any active wireless network
      const activeWifi = wifiInfo.find((wifi) =>
        activeInterfaces.some((iface) => wifi.ssid)
      );

      if (activeWifi) {
        const signalLevel = activeWifi.signalLevel || -50; // Default if not available
        const signalPercentage = Math.max(0, Math.min(100, 2 * (signalLevel + 100)));
        
        return {
          ssid: activeWifi.ssid,
          strength: signalPercentage,
          details: {
            interface: activeInterfaces[0].iface,
            type: activeInterfaces[0].type
          }
        };
      }
    }

    // Get any connected network info if WiFi detection fails
    const defaultNetwork = networkData.find(net => net.operstate === "up");
    if (defaultNetwork) {
      return {
        ssid: defaultNetwork.ifaceName || "Connected",
        strength: 100, // Default strength for wired connections
        details: {
          interface: defaultNetwork.iface,
          type: defaultNetwork.type
        }
      };
    }

    return { ssid: "No active network", strength: 0 };
  } catch (error) {
    console.error("Error fetching network strength:", error);
    throw error;
  }
};

module.exports = { getNetworkStrength };