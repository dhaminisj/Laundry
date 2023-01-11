const express = require("express");
const app = express();
const mongoose = require("mongoose");
const loginRouter = require("./routes/login");
const subscriptionRouter = require("./routes/subscription");
const laundryRouter = require("./routes/laundry");
const userRouter = require("./routes/user");
require("dotenv").config();
app.use(express.json());
app.use("/api/v1", loginRouter);
app.use("/api/v1", subscriptionRouter);
app.use("/api/v1", laundryRouter);
app.use("/api/user", userRouter);
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
