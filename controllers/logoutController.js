const logoutHandler = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successful.",
    });
  } catch (err) {
    console.error("Error logging out user:", err.message);
    return res.status(500).json({
      errors: [{ msg: "Internal server error. Please try again later." }],
    });
  }
};

module.exports = { logoutHandler };
