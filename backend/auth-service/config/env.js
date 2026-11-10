require("dotenv").config();

module.exports = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "dev-google-client-id",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "dev-google-client-secret",
    AUTH_PORT: parseInt(process.env.AUTH_PORT || process.env.PORT || "3001", 10),
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};