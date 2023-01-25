const helpAndSupportModel = require("../models/helpAndSupport");
const orderModel = require("../models/orderSchema");
const cloudinary = require("../utils/cloudinaryConfig");
const UserModel = require("../models/UserSchema");
const customerSupport = async (req, res) => {
  try {
    const { userId } = req.users;
    const describeText = req.body.describeText;
    const images = req.body.images;
    let ticketNumber, previousTicketNumber;
    let latestRecord = await helpAndSupportModel
      .find()
      .limit(1)
      .sort({ $natural: -1 });
    if (latestRecord == "") {
      ticketNumber = "#001";
    } else {
      previousTicketNumber = latestRecord[0].ticketNumber;

      ticketNumber = parseInt(previousTicketNumber.slice(1)) + 1;
      ticketNumber = "#" + ticketNumber.toString().padStart(3, "0");
    }
    if (req.files) {
            uploadFiles = [];
            for (i = 0; i < req.files.length; i++) {
                uploadFiles.push(req.files[i].path);
            }
            uploadfile = [];
            for (i = 0; i < uploadFiles.length; i++) {
                const upload = await cloudinary.uploader.upload(
                    uploadFiles[i],
                    {
                        folder: "images",
                        use_filename: true,
                    }
                );
                uploadUrl = upload.url;
                uploadfile.push(uploadUrl);
            }

           x= await helpAndSupportModel.create({
          describeText: req.body.describeText,
          userId: req.users.userId,
        //   ticketNumber: req.body.ticketNumber,
        ticketNumber,
          images:   uploadfile ,
                order: req.body.order,
                concernText: req.body.concernText,
            });
        } else {
           x= await helpAndSupportModel.create({
                describeText: req.body.describeText,
                userId: req.users.userId,
                ticketNumber,
                // ticketNumber: req.body.ticketNumber,
                order: req.body.order,
                concernText: req.body.concernText,
        });
    }

    res.status(200).json({
            statusCode: 200,
      message: "Customer support Added",
          x
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const addImages = async (req, res) => {
  try {
    uploadFiles = [];
    for (i = 0; i < req.files.length; i++) {
      uploadFiles.push(req.files[i].path);
    }
    uploadfile = [];
    for (i = 0; i < uploadFiles.length; i++) {
      const upload = await cloudinary.uploader.upload(uploadFiles[i], {
        folder: "images",
        use_filename: true,
      });
      uploadUrl = upload.url;
      uploadfile.push(uploadUrl);
    }
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const openTickets = async (req, res) => {
  try {
    const { userId } = req.users;
    const result = await helpAndSupportModel.find({ userId }).select("-images");
    if (result)
      res
        .status(200)
        .json({ statusCode: 200, message: "Open tickets fetched", result });
    else
      res
        .status(400)
        .json({ statusCode: 400, message: "Unable to fetch open tickets" });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

module.exports = {
  customerSupport,
  addImages,
  openTickets,
};
