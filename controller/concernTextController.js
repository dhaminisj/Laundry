const mongoose = require("mongoose");
//const concernText = require("../models/concernText");
const concernTextList = require("../models/concernText");

const addConcernText = async (req, res) => {
    try {
        await concernTextList.create({
            concernText: req.body.concernText,
        });
        res.status(200).send({
            status: true,
            statusCode: 200,
            message: "Concern Text added successfully",
        });
    } catch (error) {
        res.status(400).send({
            status: false,
            statusCode: 400,
            message: error,
        });
    }
};

const getConcernText = async (req, res) => {
    try {
        const result = await concernTextList.find().select("concernText -_id");
        res.status(200).send({
            status: true,
            statusCode: 200,
            result,
        });
    } catch (error) {
        res.status(400).send({
            status: false,
            statusCode: 400,
            message: error,
        });
    }
};

module.exports = { addConcernText, getConcernText };
