// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path"); // ADD THIS
const donationDetailsRoutes = require("./routes/donationDetailsRoutes");
const donationQrRoutes = require("./routes/donationQrRoutes");
const donatePageRoutes = require("./routes/donatePageRoutes");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api", donationDetailsRoutes);
app.use("/api", donationQrRoutes);
app.use("/", donatePageRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || "SERVER_ERROR",
      message: err.message || "Something went wrong",
    },
  });
});

module.exports = app;