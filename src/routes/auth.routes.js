const router = require("express").Router();

const auth = require("../controllers/auth.controller");
const otp = require("../controllers/otp.controller");
const protect = require("../middleware/auth.middleware");

const validate = require("../middleware/validation.middleware");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");

router.post("/register", registerValidation, validate, auth.register);

router.post("/verify-otp", otp.verifyOTP);

router.post("/login", loginValidation, validate, auth.login);

router.get("/me", protect, auth.getMe);

module.exports = router;
