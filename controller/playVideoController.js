const { PlayVideo } = require("../models/index");
const cloudinary = require("../utils/cloudinaryConfig");
require("dotenv").config();

const createPlayVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    imageAssest = req.file.path;
    const cloudinaryResult = await cloudinary.uploader.upload(imageAssest, {
      folder: "image",
      use_filename: true,
    });

    const obj = new PlayVideo({
      data: [
        {
          title: title,
          description: description,
          imageAssest: cloudinaryResult.url,
        },
      ],
    });
    const result = await obj.save();
    if (result)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Created PlayVideo successfully",
        data: result,
      });
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Could not add PlayVideo",
    });
  } catch (error) {
    console.log("error from createPlayVideo", error);
  }
};
const addPlayVideo = async (req, res) => {
  try {
    imageAssest = req.file.path;
    const cloudinaryResult = await cloudinary.uploader.upload(imageAssest, {
      folder: "image",
      use_filename: true,
    });
    const { title, description } = req.body;
    const obj = {
      title: title,
      description: description,
      imageAssest: cloudinaryResult.url,
    };
    const play = await PlayVideo.updateOne(
      {},
      { $push: { data: obj } },
      { new: true }
    ).clone();
    if (play)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Created PlayVideo successfully",
        data: play,
      });
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Could not add PlayVideo",
    });
  } catch (error) {
    console.log("error from createPlayVideo", error);
  }
};
const getPlayVideo = async (req, res) => {
  try {
    const pv = await PlayVideo.find({});

    if (pv)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Tutorials fetched successfully",
        data: pv,
      });
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Couldn't fetch Tutorials",
    });
  } catch (error) {
    console.log("error from getPlayVideo", error);
  }
};
module.exports = { createPlayVideo, addPlayVideo, getPlayVideo };
