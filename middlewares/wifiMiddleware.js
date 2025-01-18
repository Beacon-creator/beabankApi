const wifi = require("wifi-control");

// Initialize the library
wifi.init({
  debug: true, // Enable debug logs for troubleshooting
});

/**
 * Get Wi-Fi Network Signal Strength
 * @returns {Promise<number>} Signal strength in percentage (0-100%)
 */
const getNetworkStrength = async () => {
  try {
    const ifaceState = wifi.getIfaceState();

    if (!ifaceState.success) {
      throw new Error("Failed to retrieve network state");
    }

    // Example: Signal Strength in dBm (convert to percentage if needed)
    const dBm = ifaceState.signal_strength; // e.g., -70 dBm
    const strengthPercentage = dBmToPercentage(dBm);

    return strengthPercentage;
  } catch (error) {
    console.error("Error retrieving network strength:", error);
    return null;
  }
};

/**
 * Convert dBm to Signal Strength Percentage
 * @param {number} dBm - Signal strength in dBm
 * @returns {number} Signal strength percentage (0-100%)
 */
const dBmToPercentage = (dBm) => {
  if (dBm <= -100) return 0; // Poor signal
  if (dBm >= -50) return 100; // Excellent signal
  return 2 * (dBm + 100); // Scale from -100 to -50
};

// Example Usage
getNetworkStrength().then((strength) => {
  console.log(`Network Strength: ${strength}%`);
});
