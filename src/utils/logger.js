const ActivityLog = require("../models/ActivityLog.model");

module.exports = async (userId, action, ip) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      ip,
    });
  } catch (err) {
    console.log("Logger error:", err.message);
  }
};
