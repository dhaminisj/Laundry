const express = require("express");
const app = express();
const mongoose = require("mongoose");
const loginRouter = require("./routes/login");
const subscriptionRouter = require("./routes/subscription");
const laundryRouter = require("./routes/laundry");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const promoRouter = require("./routes/promo");
const notificationRouter = require("./routes/notification");
const walletRouter = require("./routes/wallet");
const orderRouter = require("./routes/order");
const termsRouter = require("./routes/terms");
const concernTextRouter = require("./routes/concernText");
// const laundryList = require("./models/laundryListSchema");
require("dotenv").config();
app.use(express.json());
app.use("/api/v1", loginRouter);
app.use("/api/v1", subscriptionRouter);
app.use("/api/v1", laundryRouter);
app.use("/api/user", userRouter);
app.use("/api/v1", cartRouter);
app.use("/api/v1", promoRouter);
app.use("/api/v1", walletRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", termsRouter);
app.use("/api/v1", concernTextRouter);

app.get("/", (req, res) => {
    res.send("Welcome to laundry app.............");
});

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to DB");
});

// app.get("/update", async (req, res) => {
//   const result = await laundryList
//     .updateMany(
//       {},
//       {
//         $set: {
//           singlePackDescription:
//             "Want each piece packed single, not ready to mingle? No, that's not unreasonable. To each garment, its own! Items are packed individually, with a cardboard support and in a white paper bag.",
//           singlePackUrl: "https://www.youtube.com/watch?v=CPUKWMPyOvA",
//           hangerDescription:
//             "No creases, no folds? Why not let them hang out uncrushed till you waer them? We pack your garment on a hanger, with a compostable outer cover.",
//           hangerUrl: "https://www.youtube.com/watch?v=GmHgusGNoec",
//           multiplePack: 0,
//           multiPackDescription:
//             "Pack it together, stack it together, you say. Okay. After all, you know your cupboard or suitcase better. Your garments come neatly packed and primed, in a brown paper bag.",
//           multiPackUrl: "https://www.youtube.com/watch?v=jF3dgfXEgB8",
//           starchDescription:
//             "The process for making clothes wrinkle-free longer",
//           starchUrl: "https://www.youtube.com/watch?v=GI9Uer-r8cg",
//           noStarchDescription:
//             "It just means that starch is not used in the process of steaming or ironing clothes.",
//           noStarchUrl: "https://www.youtube.com/watch?v=QsyPECwiolw",
//         },
//       }
//     )
//     .clone();
//   res.send(result);
// });

app.listen(process.env.PORT || 5000, () => {
    console.log(`running on port ${process.env.PORT}...`);
});
