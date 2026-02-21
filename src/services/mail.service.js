const transporter = require("../config/mailer");

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"SecureVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    html: `<h2>Your OTP: ${otp}</h2>`
  });
};
