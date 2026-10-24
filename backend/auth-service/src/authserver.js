const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();
const Port = 3001;

app.use(express.json());
app.use("/", authRoutes);

app.listen(Port, () => {
    console.log(`Auth service attiva su http://localhost:${Port}`);
});