require('dotenv').config();

module.exports = {
    GOOGLE_CLIENT_SECRET : process.env.client_secret,
    GOOGLE_CLIENT_ID : process.env.client_id,
    AUTH_PORT: parseInt(process.env.port || "3001"),
};