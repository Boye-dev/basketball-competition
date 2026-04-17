import dotenv from "dotenv";

dotenv.config({ quiet: true });

const config = {
  port: process.env.PORT || 5000,
  node: {
    env: process.env.NODE_ENV || "development",
    service: process.env.SERVICE_NAME || "Basketball Competition API",
  },
  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/basketball-competition",
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-me",
  saltRounds: Number(process.env.SALT_ROUNDS) || 13,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  mail: {
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || "",
  },
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5174",
  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "",
  },
};

export default config;
