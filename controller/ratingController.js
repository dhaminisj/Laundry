const subscriptionList = require("../models/subscriptionList");
const User = require("../models/UserSchema");
const ratingsModel = require("../models/ratingsSchema");
const orderModel = require("../models/orderSchema");

const addRating = async (req, res) => {
    const { userId } = req.users;
    const { star, orderId } = req.body;
    try {
        let alreadyRated = await ratingsModel.findOne({
            orderId,
            ratings: { $elemMatch: { postedby: userId } },
        });
        if (alreadyRated) {
            const updateRating = await ratingsModel.findOneAndUpdate(
                {
                    orderId,
                    ratings: { $elemMatch: { postedby: userId } },
                },
                {
                    $set: {
                        star,
                    },
                }
            );
            res.status(200).json({
                statusCode: 200,
                message: "Rating Updated Successfully.",
            });
        } else {
            const rate = new ratingsModel({
                orderId,
                star: star,
                postedby: userId,
            });
            await rate.save();
            res.status(200).json({
                statusCode: 200,
                message: "Rating Added Succesfully.",
            });
        }
    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message });
    }
};
module.exports = {
    addRating,
};
