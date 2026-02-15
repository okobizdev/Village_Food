require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const colors = require("colors");

const config = require("./src/config/config.js");
const rootRouter = require("./src/api/index.js");
const globalErrorHandler = require("./src/middleware/errors/globalErrorHandler.js");
const securityHeaders = require("./src/middleware/securityHeaders.js");
// const rateLimiter = require("./src/middleware/rateLimiter.js");
const sanitizeInput = require("./src/middleware/sanitizeInput.js");

// Initialize Express app
const app = express();

// Set timezone
moment.tz.setDefault("Asia/Dhaka");

// Security middleware
app.use(securityHeaders);

// Rate limiting
// app.use("/api", rateLimiter());

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Input sanitization (after body parsing)
app.use(sanitizeInput);

const allowedOrigins = [
  config.clientBaseURL,
  config.adminBaseURL,
  "http://localhost:3000",
  "http://localhost:3001"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Static files
app.use(`/api/v1${config.uploadPath}`, express.static(config.uploadFolder));

// API Routes
app.use("/api/v1", rootRouter);

// Health check endpoints
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Urban Attire API Server",
    version: "1.0.0",
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Global error handler
app.use(globalErrorHandler);

// Database connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(config.databaseUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(colors.green("✓ Database connected successfully"));
  } catch (err) {
    console.error(colors.red("✗ Database connection error:"), err.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log(colors.yellow("SIGTERM received, closing server gracefully..."));
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const startServer = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(colors.cyan(`✓ Server running on port ${config.port}`));
    console.log(colors.cyan(`✓ Environment: ${process.env.NODE_ENV || "development"}`));
    console.log(colors.cyan(`✓ API Base: http://localhost:${config.port}/api/v1`));
  });
};

startServer().catch((err) => {
  console.error(colors.red("Failed to start server:"), err);
  process.exit(1);
});
