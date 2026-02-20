const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const rateLimit = require("./middleware/rateLimit.middleware");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimit);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/passwords", require("./routes/password.routes"));
app.use("/api/import", require("./routes/import.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

module.exports = app;
