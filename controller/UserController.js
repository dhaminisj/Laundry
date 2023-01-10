const { User } = require("../models/index");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");
const cloudinary = require("../utils/cloudinaryConfig");
const random = require("unique-random-string");

const register = async (req, res) => {
  if (!req.body)
    res
      .status(400)
      .json({ status: false, statusCode: 400, message: "body not found" });
  const { name, phone,email, latitude, longitude, address, code } = req.body;
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
    console.log("codefound",codefound);
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

module.exports = {
  register,
};
