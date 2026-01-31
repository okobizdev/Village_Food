require("dotenv/config");

const requiredEnvVars = [
  "PORT",
  "MONGO_CONNECTION_STRING",
  "JWT_ACCESS_SECRET_KEY",
  "JWT_REFRESH_SECRET_KEY",
];

// Validate required environment variables
const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

const config = {
  // Server
  port: process.env.PORT || 5000,
  host: process.env.HOST || "localhost",
  env: process.env.NODE_ENV || "development",

  // Database
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  databasePassword: process.env.MONGO_PASSWORD,

  // JWT
  jwtAccessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
  jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,

  // File Upload
  uploadFolder: process.env.UPLOAD_FOLDER || "./uploads",
  uploadPath: process.env.UPLOAD_PATH || "/uploads",

  // Client
  clientBaseURL: process.env.CLIENT_BASE_URL || "http://localhost:3000",

  // Admin
  adminBaseURL: process.env.ADMIN_BASE_URL || "http://localhost:3001",

  // Email
  smtpService: process.env.SMTP_SERVICE || "gmail",
  smtpUser: process.env.EMAIL_USERNAME,
  smtpPass: process.env.EMAIL_PASSWORD,

  // Payment Gateway
  sslCommerz: {
    storeId: process.env.SSLCOMMERZ_STORE_ID,
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD,
    isLive: process.env.SSLCOMMERZ_IS_LIVE === "true",
  },
};

module.exports = config;
