require("dotenv").config();

const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

// ==============================
// Middlewares
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// Environment Variables
// ==============================
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL;

// ==============================
// API Gateway Routes
// ==============================

// Auth Service
app.use(
  "/api/auth",
  proxy(AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => "/api/auth" + req.url,
  })
);

// Core Service (Accommodations)
app.use(
  "/api/accommodations",
  proxy(CORE_SERVICE_URL, {
    proxyReqPathResolver: (req) => "/api/accommodations" + req.url,
  })
);

// ==============================
// Health Check
// ==============================
app.get("/", (req, res) => {
  res.json({
    message: "Tahwissa API Gateway is running 🚀",
  });
});

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});