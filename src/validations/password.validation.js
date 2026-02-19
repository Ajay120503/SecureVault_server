const { body } = require("express-validator");

exports.passwordValidation = [
  body("siteName").notEmpty(),
  body("username").notEmpty(),
  body("password").notEmpty(),
];
