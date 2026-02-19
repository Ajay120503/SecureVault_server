const OTP = require("../models/OTP.model");
const generateOTP = require("../utils/generateOTP");

exports.createOTP = async (email) => {
  const otp = generateOTP();

  await OTP.create({
    email,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return otp;
};
