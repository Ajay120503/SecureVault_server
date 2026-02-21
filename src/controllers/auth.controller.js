const User = require("../models/User.model");
const ActivityLog = require("../models/ActivityLog.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const OTP = require("../models/OTP.model");
const { sendOTP } = require("../services/mail.service");

exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = req.body.email.trim().toLowerCase();

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP + temp user data
    await OTP.create({
      email,
      otp,
      expiresAt,
      tempData: { name, password },
    });

    // Send OTP via email
    // await sendOTP(email, otp);
    sendOTP(email, otp).catch(err =>
      console.error("Mail error:", err.message)
    );

    res.status(201).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });
    if (!user.isVerified) return res.status(403).json({ msg: "Verify OTP before login" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid email or password" });

    const token = generateToken(user);

    await ActivityLog.create({
      userId: user._id,
      action: "Logged in",
      ip: req.ip,
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ME ================= */
exports.getMe = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
