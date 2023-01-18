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
      res.status(502).send({ statusCode: 502, message: "Couldn't send OTP" });
    } else {
      res
        .status(200)
        .json({ statusCode: 200, message: "OTP sent successfully" });
    }
  });
};

const verifyOtpMail = async (req, res) => {
  try {
    const isValid = totp.check(req.body.otp, process.env.SECRET_OTP);
    if(isValid){
      res.status(200).json({ statusCode: 200, message: isValid })
    }
   else{
    res.status(401).json({ statusCode: 401, message: isValid })
   }
  } catch (error) {
    res.status(500).json({ statusCode: 500, errorMessage: error.message });
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
          res
            .status(502)
            .json({ statusCode: 502, message: "Couldn't send OTP" });
        } else {
          res.status(200).json({ statusCode: 200, response });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ statusCode: 500, errorMessage: error.message });
  }
};

const verifyOtpPhone = async (req, res) => {
  try {
    const isValid = totp.check(req.body.otp, process.env.SECRET_OTP);
    if(isValid){
      res.status(200).json({ statusCode: 200, message: isValid })
    }
   else{
    res.status(401).json({ statusCode: 401, message: isValid })
   }
  } catch (error) {
    res.status(500).json({ statusCode: 500, errorMessage: error.message });
  }
};

module.exports = { sendOtpMail, verifyOtpMail, verifyOtpPhone, sendOtpPhone };
