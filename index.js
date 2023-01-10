const express = require("express");
const app = express();
const mongoose = require("mongoose");
const loginRouter = require("./routes/login");
const subscriptionRouter = require("./routes/subscription");
const laundaryRouter = require("./routes/laundary");
require("dotenv").config();
app.use(express.json());
app.use("/api/v1", loginRouter);
app.use("/api/v1", subscriptionRouter);
app.use("/api/v1", laundaryRouter);
app.get("/", (req, res) => {
  res.send("Welcome to laundry app.............");
});

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("connected to DB");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`running on port ${process.env.PORT}...`);
});
