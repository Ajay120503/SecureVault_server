const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
  tempData: {
    name: String,
    password: String,
  },
});

module.exports = mongoose.model("OTP", otpSchema);