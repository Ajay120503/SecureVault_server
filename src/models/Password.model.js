const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  siteName: String,
  username: String,
  encryptedPassword: String,
  iv: String,
  category: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Password", passwordSchema);
