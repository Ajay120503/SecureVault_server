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

// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");

// const OAuth2 = google.auth.OAuth2;

// const createTransporter = async () => {
//   try {
//     const oauth2Client = new OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       "https://developers.google.com/oauthplayground"
//     );

//     oauth2Client.setCredentials({
//       refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//     });

//     // Automatically generate fresh access token
//     const accessToken = await oauth2Client.getAccessToken();

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: process.env.EMAIL_USER,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//         accessToken: accessToken.token,
//       },

//       // Cloud-safe settings
//       connectionTimeout: 20000,
//       greetingTimeout: 20000,
//       socketTimeout: 30000,
//     });

//     return transporter;
//   } catch (error) {
//     console.error("Mailer creation error:", error);
//     throw error;
//   }
// };

// module.exports = createTransporter;