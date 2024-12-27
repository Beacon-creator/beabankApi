const { User } = require("../models/userModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// Upload profile picture handler
const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware attaches user to req
    const newProfilePicPath = `uploads/${req.file.filename}`;

    // Fetch the user's current data to check for an existing profile picture
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user already has a profile picture
    if (user.profilePic) {
      const oldProfilePicPath = path.resolve(user.profilePic);

      // Delete the old profile picture if it exists on the server
      if (fs.existsSync(oldProfilePicPath)) {
        fs.unlinkSync(oldProfilePicPath);
      }
    }

    // Update the user's profile picture in the database
    user.profilePic = newProfilePicPath;
    await user.save();

    return res.status(200).json({ profilePicUrl: newProfilePicPath });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({ error: "Failed to upload profile picture" });
  }
};

module.exports = { upload, uploadProfilePic };
