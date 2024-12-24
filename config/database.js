const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.set("strictQuery", false); // Maintain strict query compliance

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Connected to MongoDB database successfully: ${conn.connection.host}`
    );
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exit(1); // Exit the process in case of a critical error
  }
};

module.exports = dbConnect;
