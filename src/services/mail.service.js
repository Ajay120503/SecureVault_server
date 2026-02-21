const transporter = require("../config/mailer");

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"SecureVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    html: `<h2>Your OTP: ${otp}</h2>`
  });
};

// const createTransporter = require("../config/mailer");

// exports.sendOTP = async (email, otp) => {
//   try {
//     const transporter = await createTransporter();

//     await transporter.sendMail({
//       from: `"SecureVault" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "OTP Verification",
//       html: `<h2>Your OTP: ${otp}</h2>`,
//     });

//     console.log("OTP email sent");
//   } catch (err) {
//     console.error("Mail error:", err.message);
//   }
// };