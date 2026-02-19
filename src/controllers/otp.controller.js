const OTP = require("../models/OTP.model");
const User = require("../models/User.model");

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // ✅ expiry check
    if (record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // ✅ user exists check
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ verify account
    user.isVerified = true;
    await user.save();

    // ✅ remove OTPs
    await OTP.deleteMany({ email });

    res.json({
      message: "Account verified successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
