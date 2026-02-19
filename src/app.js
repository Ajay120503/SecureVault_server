const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const rateLimit = require("./middleware/rateLimit.middleware");

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimit);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/passwords", require("./routes/password.routes"));
app.use("/api/import", require("./routes/import.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

module.exports = app;
