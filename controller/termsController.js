const { User, Terms } = require("../models/index");
const { mongoose } = require("mongoose");
require("dotenv").config();

const createTermsAndCondition = async (req, res) => {
  try {
    const { gTitle, gBody, pTitle, pBody } = req.body;
    const obj = new Terms({
      genericTerms: [{ genericTermsTitle: gTitle, genericTermsBody: gBody }],
      privacyPolicy: [
        {
          privacyPolicyTitle: pTitle,
          privacyPolicyBody: pBody,
        },
      ],
    });

    const result = await obj.save();
    if (result)
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Added T&C successfully",
        data: result,
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Could not add T&C",
    });
  } catch (error) {
    console.log("error from register", error);
  }
};
const addGenericTerms = async (req, res) => {
  try {
    // const { gTitle, gBody } = req.body;
    const allData = req.body;

    // const obj = {
    //   genericTermsTitle: gTitle,
    //   genericTermsBody: gBody,
    // };
    // console.log(obj);
    const generic = await Terms.updateOne(
      {},
      { $push: { genericTerms: { $each: allData } } },
      //{ $push: { genericTerms: obj } },
      { new: true }
    ).clone();
    if (generic)
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Added generic terms successfully",
        data: generic,
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "could not add generic terms",
    });
  } catch (error) {
    console.log("error from addGenericTerms", error);
  }
};
const addPrivacyPolicy = async (req, res) => {
  try {
    //const { pTitle, pBody } = req.body;
    const allData = req.body;
    // const obj = {
    //   privacyPolicyTitle: pTitle,
    //   privacyPolicyBody: pBody,
    // };
    const privacy = await Terms.updateOne(
      {},
      { $push: { privacyPolicy: { $each: allData } } },
      //  { $push: { privacyPolicy: obj } },
      { new: true }
    ).clone();
    if (privacy) {
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Added privacy terms successfully",
        data: privacy,
      });
    } else {
      return res.status(200).json({
        status: false,
        statusCode: 400,
        message: "could not add privacy terms",
      });
    }
  } catch (error) {
    console.log("error from addprivacyPolicy", error);
  }
};
const getTermsAndCondition = async (req, res) => {
  try {
    const tandc = await Terms.find({});

    if (tandc)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Terms and condition fetched successfully",
        data: tandc,
      });
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Couldn't fetch Terms and condition",
    });
  } catch (error) {
    console.log("error from getTermsAndCondition", error);
  }
};

module.exports = {
  createTermsAndCondition,
  addGenericTerms,
  addPrivacyPolicy,
  getTermsAndCondition,
};
