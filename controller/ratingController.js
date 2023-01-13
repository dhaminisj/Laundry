const subscriptionList = require("../models/subscriptionList");
const User = require("../models/UserSchema");

const addRating = async (req, res) => {
    const { _id } = req.users;
    const { star, subscriptionId } = req.body;
    try {
        const subscription = await subscriptionList.findById(subscriptionId);
        let alreadyRated = await subscription.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await subscriptionList.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
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
                message: "Rating Updated",
            });
        } else {
            const rate = await subscriptionList.findByIdAndUpdate(
                subscriptionId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            postedby: _id,
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
        res.status(400).json({ message: error.message });
    }
};
module.exports = {
    addRating,
};
