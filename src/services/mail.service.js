const transporter = require("../config/mailer");

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    to: email,
    subject: "OTP Verification",
    html: `<h2>Your OTP: ${otp}</h2>`
  });
};
