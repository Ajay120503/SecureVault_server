const User = require("../models/User.model");
const ActivityLog = require("../models/ActivityLog.model");

/* ================= GET USERS ================= */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ================= TOGGLE USER STATUS ================= */
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = !user.isVerified;
    await user.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: `Toggled status of user ${user.name} (${user.email})`,
      ip: req.ip,
    });

    res.json({ message: "User status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle user status" });
  }
};

/* ================= GET LOGS ================= */
exports.getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

/* ================= GET STATS ================= */
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const admins = await User.countDocuments({ role: "admin" });
    const totalLogs = await ActivityLog.countDocuments();
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivities = await ActivityLog.countDocuments({ createdAt: { $gte: last24h } });

    res.json({ totalUsers, verifiedUsers, admins, totalLogs, recentActivities });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

/* ================= DELETE USER ================= */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ message: "Admin users cannot be deleted" });

    if (req.user._id === id)
      return res.status(403).json({ message: "You cannot delete your own account" });

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
