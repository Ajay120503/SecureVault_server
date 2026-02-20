// const OTP = require("../models/OTP.model");
// const User = require("../models/User.model");

// exports.verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const record = await OTP.findOne({ email, otp });

//     if (!record) {
//       return res.status(400).json({
//         message: "Invalid OTP",
//       });
//     }

//     if (record.expiresAt.getTime() < Date.now()) {
//       return res.status(400).json({
//         message: "OTP expired",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     user.isVerified = true;
//     await user.save();

//     await OTP.deleteMany({ email });

//     res.json({
//       message: "Account verified successfully",
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

// controllers/otp.controller.js
const OTP = require("../models/OTP.model");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // Create user now
    const hashedPassword = await bcrypt.hash(record.tempData.password, 10);
    const user = await User.create({
      name: record.tempData.name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    // Remove OTP record
    await OTP.deleteMany({ email });

    res.json({ message: "Account verified successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};