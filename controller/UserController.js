const { User } = require("../models/index");
const transaction = require("../models/transactionSchema");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");
const cloudinary = require("../utils/cloudinaryConfig");
const random = require("unique-random-string");
const { totp } = require("otplib");
require("dotenv").config();

const register = async (req, res) => {
  if (!req.body)
    res
      .status(400)
      .json({ status: false, statusCode: 400, message: "body not found" });
  const { name, phone, email, latitude, longitude, address, invitedCode } =
    req.body;
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
  let usercode = random(10, (err, uniqueString) => {
    if (err) return err;
    else return uniqueString;
  });
  try {
    let user;
    const codefound = await User.findOne(
      { code: invitedCode },
      { _id: 1, wallet: 1 }
    );
    if (codefound) {
      user = new User({
        name,
        phone,
        email,
        latitude,
        longitude,
        address,
        code: usercode,
        wallet: 40,
      });
      await User.findOneAndUpdate(
        { code: invitedCode },
        { wallet: codefound.wallet + 40 }
      );
      [data] = await User.find({ code: invitedCode });
      await transaction.create({
        userId: data._id,
        orderId: "#id" + Math.random().toString(10).slice(3),
        totalPrice: 40,
        walletBalance: data.wallet,
        transactionType: "CASHBACK",
      });
    } else {
      user = new User({
        name,
        phone,
        email,
        latitude,
        longitude,
        address,
        code: usercode,
      });
    }
    const result = await user.save();
    [data] = await User.find({ phone: req.body.phone });
    await transaction.create({
      userId: data._id,
      orderId: "#id" + Math.random().toString(10).slice(3),
      totalPrice: 40,
      walletBalance: data.wallet,
      transactionType: "CASHBACK",
    });
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

      res.header("Refresh-Token", refreshToken);
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
const login = async (req, res) => {
  try {
    const isValid = totp.check(req.body.otp, process.env.SECRET_OTP);
    if (!req.body)
      res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body not found" });
    console.log(req.body);
    const { phone, otp } = req.body;
    const userfound = await User.findOne({ phone });
    if (userfound) {
      console.log(userfound);
      if (isValid) {
        const accessToken = jwt.sign(
          { userId: userfound._id, phone: userfound.phone },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60d" }
        );
        const refreshToken = jwt.sign(
          { userId: userfound._id, phone: userfound.phone },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "100d" }
        );
        await User.updateOne({ _id: userfound._id }, { refreshToken });
        res.header("Refreh-Token", refreshToken);
        res.header("Authorization", "Bearer " + accessToken);
        return res.status(200).json({
          status: true,
          statusCode: 200,
          message: "User Logged in Succesfully",
        });
      } else {
        res.status(401).json({ statusCode: 401, message: "otp invalid" });
      }
    } else
      return res.status(403).json({
        status: true,
        statusCode: 403,
        message: "Phone number does not exist.",
      });
  } catch (error) {
    console.log("error from login", error);
  }
};
const updateUserProfilePic = async (req, res) => {
  try {
    const { userId } = req.users;
    console.log(req.users);
    let user;
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

      if (user)
        return res.status(200).json({
          status: true,
          statusCode: 200,
          message: "profile updated successfully",
          data: cloudinaryResult.url,
        });
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "profile cannot be updated",
      });

      //profilePic = cloudinaryResult.secure_url;
    } else {
      return res.status(404).json({
        statusCode: 404,
        message: "Please send user profile pic to update",
      });
    }
    // updatedData = {
    //   profilePic,
    // };

    // const user = await User.findOneAndUpdate({ _id: userId }, updatedData, {
    //   new: true,
    // }).select("profilePic name email phone");
  } catch (error) {
    console.log("error from update userProfilePic", error);
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.users;
    const user = await User.find({ _id: userId }).select(
      "-totalearned -__v -refreshToken -wallet"
    );
    if (user)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Profile fetched successfully",
        data: user,
      });
    res.status(400).json({
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

    console.log(userId);
    const { houseNo, area, pinCode, state, types, primary } = req.body;
    const obj = {
      houseNo,
      area,
      pinCode,
      state,
      types,
      primary,
    };
    console.log(obj);
    const result = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { address: obj } },
      { new: true }
    );
    console.log(result);
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Added address successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error, couldn't add address", error);
  }
};

const updateAddress = async (req, res) => {
  try {
    const { userId } = req.users;
    const { addressId, houseNo, area, pinCode, state, types, primary } =
      req.body;

    const addressFound = await User.find({
      $and: [{ _id: userId }, { "address._id": addressId }],
    });
    if (addressFound.length != 0) {
      const obj = {
        houseNo,
        area,
        pinCode,
        state,
        types,
        primary,
      };

      const result = await User.findOneAndUpdate(
        {
          _id: userId,
          "address._id": addressId,
        },
        {
          $set: {
            "address.$.houseNo": req.body.houseNo,
            "address.$.area": req.body.area,
            "address.$.pinCode": req.body.pinCode,
            "address.$.state": req.body.state,
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
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Cannot update address ",
      });
  } catch (error) {
    console.log("Error from updateAddress", error);
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const { userId } = req.users;

    User.findOneAndUpdate(
      { _id: userId, "address._id": addressId },
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
      }
    );
  } catch (error) {
    console.log("Error from delete Address", error);
  }
};
const getAddress = async (req, res) => {
  try {
    const { userId } = req.users;
    const user = await User.find({ _id: userId }).select("address");
    //.select("address.houseNo address.flat address.pinCode address.types address.primary");
    console.log(user);
    if (user)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Address fetched successfully",
        data: user,
      });
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Couldn't fetch Address",
    });
  } catch (error) {
    console.log("error from get address", error);
  }
};
// const editProfile = async (req, res) => {
//   try {
//     if (!req.body)
//       return res
//         .status(400)
//         .json({ status: false, statusCode: 400, message: "body is not found" });
//     if (!req.users)
//       return res
//         .status(400)
//         .json({ status: false, statusCode: 400, message: "user is not found" });
//     const { userId } = req.users;
//     const { name, phone, email } = req.body;
//     const user = await User.findOne({ _id: userId });
//     if (phone) {
//       if (user.phone != phone) {
//         const accessToken = jwt.sign(
//           { userId: user._id, phone: user.phone },
//           process.env.ACCESS_TOKEN_SECRET,
//           { expiresIn: "60d" }
//         );
//         const refreshToken = jwt.sign(
//           { userId: user._id, phone: user.phone },
//           process.env.REFRESH_TOKEN_SECRET,
//           { expiresIn: "100d" }
//         );
//         const obj = {
//           name,
//           phone: phone,
//           email,
//           refreshToken: refreshToken,
//         };
//         await User.findOneAndUpdate({ _id:user}, obj);
//         res.header("Authorization", "Bearer " + accessToken);
//         return res.status(200).json({
//           status: true,
//           statusCode: 200,
//           message: " Profile succesfully updated",
//         });
//       }
//     }
//     const obj = {
//       name,
//       email,
//     };
//     await User.findOneAndUpdate({ _id:userId }, obj);
//     return res.status(200).json({
//       status: true,
//       statusCode: 200,
//       message: " Profile succesfully updated",
//     });
//   } catch (error) {
//     console.log("error from get address", error);
//   }
// };

const editProfile = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    if (!req.users)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "user is not found" });
    const { userId } = req.users;
    const { name, phone, email } = req.body;
    const user = await User.findOne({ _id: userId });

    const obj = {
      name,
      phone,
      email,
    };
    await User.findOneAndUpdate({ _id: user._id }, obj);
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: " Profile succesfully updated",
    });
  } catch (error) {
    console.log("error from edit profile", error);
  }
};

const logout = async (req, res) => {
  try {
    const refreshHeader = req.headers["refresh-token"];
    if (!refreshHeader)
      return res.status(204).json({
        status: false,
        statusCode: 204,
        message: "No refresh token found",
      });
    User.findOneAndUpdate(
      { refreshToken: refreshHeader },
      { refreshToken: "" },
      (err, docs) => {
        if (!docs)
          return res.status(404).json({
            status: false,
            statusCode: 404,
            message: "No refresh token matched",
          });
        delete req.headers["refresh-token"];
        delete req.headers["authorization"];

        res.json({
          status: true,
          statusCode: 200,
          message: "User logged out successfully",
        });
      }
    );
  } catch (error) {
    console.log("error from logout", error);
  }
};

module.exports = {
  register,
  login,
  updateUserProfilePic,
  getProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddress,
  editProfile,
  logout,
};
