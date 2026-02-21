// const nodemailer = require("nodemailer");

// module.exports = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


const nodemailer = require("nodemailer");
const dns = require("dns");

// FORCE IPv4 FIRST (fix Render Gmail issue)
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  family: 4,
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;