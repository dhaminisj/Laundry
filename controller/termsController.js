const { User, Terms } = require("../models/index");
const { mongoose } = require("mongoose");
require("dotenv").config();

const addGenericTerms = async (req, res) => {
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

    // const objj = {
    //   gTitle,
    //   gBody,
    //   pTitle,
    //   pBody,
    // };

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
  } catch (error) {}
};
module.exports = {
  addGenericTerms,
};
