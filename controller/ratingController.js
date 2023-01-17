const subscriptionList = require("../models/subscriptionList");
const User = require("../models/UserSchema");
const ratingsModel = require("../models/ratingsSchema");

const addRating = async (req, res) => {
  const { userId } = req.users;
  const { star, subscriptionId } = req.body;
  try {
    let alreadyRated = await ratingsModel.findOne({
      subscriptionId,
      ratings: { $elemMatch: { postedby: userId } },
    });
    if (alreadyRated) {
      const updateRating = await ratingsModel.findOneAndUpdate(
        {
          subscriptionId,
          ratings: { $elemMatch: { postedby: userId } },
        },
        {
          $set: {
            star,
          },
        }
      );
      res.status(200).json({
        message: "Rating Updated Successfully",
      });
    } else {
      const rate = new ratingsModel({
        subscriptionId,
        star: star,
        postedby: userId,
      });
      await rate.save();
      res.status(200).json({
        message: "Rating Added Succesfully",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  addRating,
};
