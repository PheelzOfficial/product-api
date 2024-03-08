const accountModel = require("../models/accountModel");
const crypto = require("crypto");

const generateOtp = async (email) => {
  let timestamp = Date.now();
  let date = new Date().toDateString();
  let hash = crypto
    .createHash("sha256")
    .update(email + timestamp + date)
    .digest("hex");

  let otp = hash.substring(0, 6);
  let checkOtp = await accountModel.findOne({ otp: otp });

  while (checkOtp) {
    timestamp = Date.now();
    date = new Date().toDateString();
    hash = crypto
      .createHash("sha256")
      .update(email + timestamp + date)
      .digest("hex");
    console.log(hash);
    otp = hash.substring(0, 6);
    checkOtp = await accountModel.findOne({ otp: otp });
  }

  return otp;
};

module.exports = { generateOtp };
