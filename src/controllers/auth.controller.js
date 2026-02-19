const User = require("../models/User.model");
const ActivityLog = require("../models/ActivityLog.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const { createOTP } = require("../services/otp.service");
const { sendOTP } = require("../services/mail.service");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, isVerified: false });

    const otp = await createOTP(email);
    await sendOTP(email, otp);

    await ActivityLog.create({
      userId: user._id,
      action: "Registered new account",
      ip: req.ip,
    });

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
