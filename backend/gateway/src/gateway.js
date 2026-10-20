const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware"); //definizione reverse proxy
const config = require("../config/env");

const app = express();


app.use("/api/v1", createProxyMiddleware({ //tutte le richieste api vengono gestite qui
    target: config.SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        "^/api/v1": ""
    }
}));

app.listen(config.GATEWAY_PORT, () => {
    console.log(`Gateway attivo su http://localhost:${config.GATEWAY_PORT}/api/v1`);
});