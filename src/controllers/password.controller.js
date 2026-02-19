const Password = require("../models/Password.model");
const { encryptPassword, decryptPassword } = require("../services/encryption.service");
const { detectCategory } = require("../utils/categoryDetector");
const ActivityLog = require("../models/ActivityLog.model");

/* ================= ADD PASSWORD ================= */
exports.addPassword = async (req, res) => {
  try {
    const { siteName, username, password } = req.body;
    if (!siteName || !username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await Password.findOne({ userId: req.user.id, siteName, username });
    if (existing) return res.status(400).json({ message: "Password already exists" });

    const { encrypted, iv } = encryptPassword(password);
    const category = detectCategory ? detectCategory(siteName) : "Other";

    await Password.create({ userId: req.user.id, siteName, username, encryptedPassword: encrypted, iv, category });

    await ActivityLog.create({
      userId: req.user.id,
      action: `Added password for site ${siteName}`,
      ip: req.ip,
    });

    res.status(201).json({ message: "Password saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PASSWORDS ================= */
exports.getPasswords = async (req, res) => {
  try {
    const data = await Password.find({ userId: req.user.id });
    const decrypted = data.map((p) => ({ ...p._doc, password: decryptPassword(p.encryptedPassword, p.iv) }));

    res.json(decrypted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE PASSWORD ================= */
exports.deletePassword = async (req, res) => {
  try {
    const passwordId = req.params.id;
    const password = await Password.findOne({ _id: passwordId, userId: req.user.id });
    if (!password) return res.status(404).json({ message: "Password not found or unauthorized" });

    await Password.deleteOne({ _id: passwordId });

    await ActivityLog.create({
      userId: req.user.id,
      action: `Deleted password for site ${password.siteName}`,
      ip: req.ip,
    });

    res.json({ message: "Password deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

/* ================= UPDATE PASSWORD ================= */
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const passwordDoc = await Password.findOne({ _id: id, userId: req.user.id });
    if (!passwordDoc) return res.status(404).json({ message: "Password not found" });

    if (req.body.password) {
      const { encrypted, iv } = encryptPassword(req.body.password);
      passwordDoc.encryptedPassword = encrypted;
      passwordDoc.iv = iv;
    }
    if (req.body.siteName) passwordDoc.siteName = req.body.siteName;
    if (req.body.username) passwordDoc.username = req.body.username;

    await passwordDoc.save();

    await ActivityLog.create({
      userId: req.user.id,
      action: `Updated password for site ${passwordDoc.siteName}`,
      ip: req.ip,
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};
