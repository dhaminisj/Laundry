const { User } = require("../models/index");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");
const cloudinary = require("../utils/cloudinaryConfig");
const random = require("unique-random-string");
require("dotenv").config();

const register = async (req, res) => {
  if (!req.body)
    res
      .status(400)
      .json({ status: false, statusCode: 400, message: "body not found" });
  const { name, phone, email, latitude, longitude, address, code } = req.body;
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty())
    return res.status(403).json({
      status: false,
      statusCode: 403,
      message: "validation Error",
    });

  const userfound = await User.findOne({ phone });
  if (userfound)
    return res.status(403).json({
      status: false,
      statusCode: 403,
      message: "User with this phone number already present",
    });
  let usercode = random(6, (err, uniqueString) => {
    if (err) return err;
    else return uniqueString;
  });
  try {
    const user = new User({
      name,
      phone,
      email,
      latitude,
      longitude,
      address,
      code: usercode,
    });
    console.log("user", user);
    const codefound = await User.findOne({ code }, { _id: 1, totalearned: 1 });
    console.log("codefound", codefound);
    if (codefound) {
      await User.findByIdAndUpdate(
        codefound._id,
        { totalearned: codefound.totalearned + 40 },
        { new: true }
      );
    }

    const result = await user.save();
    if (result) {
      const accessToken = jwt.sign(
        { userId: result._id, phone: result.phone },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60d" }
      );

      const refreshToken = jwt.sign(
        { userId: result._id, phone: result.phone },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "100d" }
      );
      await User.findOneAndUpdate(
        { _id: result._id },
        { refreshToken: refreshToken }
      );

      //   res.header("Refresh-Token", refreshToken);
      res.header("Authorization", "Bearer " + accessToken);
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: " User succesfully registered",
      });
    } else
      res.status(500).json({
        status: false,
        statusCode: 200,
        message: "couldnt register user",
        data: {},
      });
  } catch (error) {
    console.log("error from register", error);
  }
};
const updateUserProfilePic = async (req, res) => {
  try {
    const { userId } = req.body;
    if (req.file) {
      profilePic = req.file.path;
      cloudinaryResult = await cloudinary.uploader.upload(profilePic, {
        folder: "image",
        use_filename: true,
      });
      user = await User.findOneAndUpdate(
        { _id: userId },
        { profilePic: cloudinaryResult.url }
      );
      console.log(cloudinaryResult.url);

      //profilePic = cloudinaryResult.secure_url;
    } else {
      return res.status(404).json({
        message: "Please send user profile pic to update",
      });
    }
    // updatedData = {
    //   profilePic,
    // };

    // const user = await User.findOneAndUpdate({ _id: userId }, updatedData, {
    //   new: true,
    // }).select("profilePic name email phone");
    if (user)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "profile updated successfully",
        data: user,
      });
    res.status(404).json({
      status: false,
      statusCode: 400,
      message: "profile cannot be updated",
    });
  } catch (error) {
    console.log("error from update userProfilePic", error);
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.users;
    console.log(userId);
    const user = await User.find({ _id: userId }).select(
      " name profilePic plan phone email "
    );
    if (user)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Profile fetched successfully",
        data: user,
      });
    res.status(404).json({
      status: false,
      statusCode: 400,
      message: "Couldn't fetch Profile",
    });
  } catch (error) {
    console.log("error from getProfile", error);
  }
};

const addAddress = async (req, res) => {
  try {
    const { userId } = req.users;
    const { houseNo, flat, pinCode, city, types, primary } = req.body;
    const obj = {
      houseNo,
      flat,
      pinCode,
      city,
      types,
      primary,
    };
    console.log(obj);
    const result = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { address: obj } },
      { new: true }
    );
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Added address successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error, couldn't add ground", error);
  }
};

const updateAddress = async (req, res) => {
  try {
    const { userId } = req.users;
    const { addressId, houseNo, flat, pinCode, city, types, primary } =
      req.body;

    const addressFound = await User.find({
      $and: [{ _id: userId }, { "address._id": addressId }],
    });
    if (addressFound.length != 0) {
      console.log("abc");

      const obj = {
        houseNo,
        flat,
        pinCode,
        city,
        types,
        primary,
      };
      console.log("add", addressFound);
      console.log("ob", obj);
      const result = await User.findOneAndUpdate(
        {
          _id: userId,
          "address._id": addressId,
        },
        {
          $set: {
            "address.$.houseNo": req.body.houseNo,
            "address.$.flat": req.body.flat,
            "address.$.pinCode": req.body.pinCode,
            "address.$.city": req.body.city,
            "address.$.types": req.body.types,
            "address.$.primary": req.body.primary,
          },
        },
        { new: true }
      );
      console.log("result", result);
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "updated address successfully",
        data: result,
      });
    } else
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Cannot update address ",
        data: result,
      });
  } catch (error) {
    console.log("Error from updateAddress", error);
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const { userId } = req.users;

    User.findOneAndUpdate({ _id: userId, "address._id" : addressId },
    {
      $pull: {
        address: {
          _id: addressId,
        },
      },
    },
      function (err) {
        if (err)
          return res
            .status(400)
            .json({ status: false, statusCode: 400, message: " error" });
        else
          return res.status(200).json({
            status: true,
            statusCode: 200,
            message: "address deleted ",
          });
      })
  } catch (error) {
    console.log("Error from delete Address", error);
  }
};

module.exports = {
  register,
  updateUserProfilePic,
  getProfile,
  addAddress,
  updateAddress,
  deleteAddress,
};
