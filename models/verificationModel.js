const {mongoose, Schema} = require("mongoose")

const UserOTPVerificationSchema = new Schema({
  userId: String,
  otp: String,
  rawOTP: String,
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const UserOTPVerification = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);

module.exports = { UserOTPVerification };
