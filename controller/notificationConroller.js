const mongoose = require("mongoose");
const notificationModel = require("../models/notificationSchema");

const addNotifications = async (req, res) => {
    try {
        await notificationModel.create({
            notification: req.body.notification,
            description: req.body.description,
        });
        res.status(200).json({
            message: "Notification added successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
};
const getNotifications = async (req, res) => {
    try {
        const { userId } = req.users;
        const result = await notificationModel.find();
        res.status(200).send({
            Notification: result,
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
};

module.exports = { addNotifications, getNotifications };
