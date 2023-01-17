const subscriptionList = require("../models/subscriptionList");
const User = require("../models/UserSchema");
const ratingsModel =require("../models/ratingsSchema")

const addRating = async (req, res) => {
    const { userId } = req.users;
    const { star, subscriptionId } = req.body;
    try {
        // const subscription = await subscriptionList.findById(subscriptionId);
        let alreadyRated = await subscriptionList.findOne({
            _id: subscriptionId,
            ratings: { $elemMatch: { postedby: userId } },
        });
        //console.log(alreadyRated);
        if (alreadyRated) {
            const updateRating = await subscriptionList.findOneAndUpdate(
                {
                    _id: subscriptionId,
                    ratings: { $elemMatch: { postedby: userId } },
                },
                {
                    $set: {
                        "ratings.$.star": star,
                    },
                },
                {
                    new: true,
                }
            );
            res.status(200).json({
                message: "Rating Updated Successfully",
            });
        } else {
            const rate = await subscriptionList.updateOne(
                { _id: subscriptionId },
                {
                    $push: {
                        ratings: {
                            star: star,
                            postedby: userId,
                        },
                    },
                },
                {
                    new: true,
                }
            );
            res.status(200).json({
                message: "Rating Added Succesfully",
            });
        }
    } catch (error) {
        // console.log(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addRating,
};
