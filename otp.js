const nodemailer = require("nodemailer");
const { totp } = require("otplib");
const Nexmo = require("nexmo");

const sendOtpMail = async (req, res) => {
  totp.options = { digits: 6, algorithm: "sha512", step: 16660 };
  const otp = totp.generate(process.env.SECRET_OTP);
  const transporter = nodemailer.createTransport({
    service: "zohomail",
    auth: {
      user: process.env.ZOHO_MAIL,
      pass: process.env.ZOHO_PASS,
    },
    port: 465,
    host: "smtp.zoho.in",
    secure: true,
  });
  const mailOptions = {
    from: process.env.ZOHO_MAIL,
    to: req.body.email,
    subject: "laundry OTP",
    text: `laundry Otp is ${otp}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send({
        message: error,
      });
    } else {
      res.json({
        message: "OTP sent successfully",
      });
    }
  });
};

const verifyOtpMail = async (req, res) => {
  try {
    const isValid = totp.check(req.body.otp, process.env.SECRET_OTP);
    res.json({
      message: isValid,
    });
  } catch (error) {
    res.send(error.message);
  }
};

const sendOtpPhone = async (req, res) => {
  try {
    totp.options = { digits: 4, algorithm: "sha512", step: 16660 };

    const otp = totp.generate(process.env.SECRET_OTP);

    const dest = req.body.destination;

    const nexmo = new Nexmo({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });

    const from = "laundry Otp verification";
    const to = `${dest}`;
    const text = `HEllo from laundry, this is your otp for verification is ${otp} `;

    const x = await nexmo.message.sendSms(
      "+919481676348",
      Number(dest),
      text,
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.send(response);
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

const verifyOtpPhone = async (req, res) => {
  try {
    const isValid = totp.check(req.body.otp, process.env.SECRET_OTP);
    res.json({
      message: isValid,
    });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { sendOtpMail, verifyOtpMail, verifyOtpPhone, sendOtpPhone };
