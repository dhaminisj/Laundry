const subscriptionList = require("../models/subscriptionList");
const User = require("../models/UserSchema");

const addRating = async (req, res) => {
    const { userId } = req.users;
    const { star, subscriptionId } = req.body;
    try {
        const subscription = await subscriptionList.findById(subscriptionId);
        let alreadyRated = await subscriptionList.findOne(
            { ratings: { $elemMatch: { postedby: userId } } }
        );
        if (alreadyRated) {
            const updateRating = await subscriptionList.updateOne(
                {
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
                message: "Rating Updated",
            });
        } else {
            const rate = await subscriptionList.findByIdAndUpdate(
                subscriptionId,
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
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};
module.exports = {
    addRating,
};
