const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("welcome");
});
app.listen(port, () => {
    console.log("Server is up on port..");
});

app.get("/", (req, res) => {
    res.send("welcome");
});
