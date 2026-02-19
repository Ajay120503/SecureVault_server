const { encrypt, decrypt } = require("../config/encryption");

exports.encryptPassword = encrypt;
exports.decryptPassword = decrypt;
