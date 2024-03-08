const accountModel = require("../models/accountModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createAccountValidation,
  loginValidation,
} = require("../middlewares/validate");
const { generateOtp } = require("../middlewares/otpgenerator");
const { MailSending } = require("../middlewares/email");

const createAccount = async (req, res) => {
  try {
    const { error } = createAccountValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    const checkemail = await accountModel.findOne({ email: req.body.email });
    if (checkemail) {
      return res
        .status(409)
        .json({ message: "Email already exist !", success: false });
    }

    await accountModel.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    return res
      .status(200)
      .json({ message: "Account created successfully", success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error occured !", success: false, error: err.message });
  }
};

const loginAccount = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    const { email, password } = req.body;
    const emailExist = await accountModel.findOne({ email: email });

    if (!email) {
      return res
        .status(401)
        .json({ message: "Email/Password mismatch", success: false });
    }

    const comparePassword = await bcrypt.compare(password, emailExist.password);
    if (comparePassword) {
      const token = await jwt.sign(
        { id: emailExist._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.header("Authorization", token).json({
        message: "Logged in successfully",
        success: true,
        token,
        user: emailExist,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Email/Password mismatch", success: false });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error occured !", success: false, error: err.message });
  }
};

const forgetPasword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(404)
        .json({ message: "Email can not be empty", success: false });
    }

    const account = await accountModel.findOne({ email: email });
    if (!account) {
      return res
        .status(404)
        .json({ message: "Account not found !", success: false });
    }
    const otp = await generateOtp(email);
    account.otp = otp;
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    account.otpExpireDate = date;
    const option = {
      email: email,
      subject: "FORGET PASSWORD OTP",
      message: `You just initiated a forgot password process\n Use the otp below\nOTP: ${otp}\n This code is expiring in the next 10 minutes`,
    };

    await MailSending(option);
    // if (emailing === true) {
    await account.save();
    return res
      .status(200)
      .json({ message: "Check your email for otp", success: true });
    // } else {
    //   return res
    //     .status(400)
    //     .json({ message: "Email can't be sent !", success: false });
    // }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error ocured !", success: false, error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(404).json({ message: "OTP is empty", success: false });
    }

    const account = await accountModel.findOne({ otp: otp });

    if (!account) {
      return res.status(404).json({ message: "Invalid OTP", success: false });
    }

    const date = Date.now();

    if (account.otpExpireDate >= date) {
      return res
        .status(200)
        .json({ message: "OTP verified", otp: otp, success: true });
    } else {
      return res
        .status(404)
        .json({ message: "OTP has expired", success: false });
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Error ocured !", success: false, error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const otp = req.params.otp;
    if (!otp) {
      return res
        .status(400)
        .json({ message: "Password reset failed", success: false });
    }
    const { password, repeatPassword } = req.body;

    if (
      !password ||
      !repeatPassword ||
      password.trim() === "" ||
      repeatPassword.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Password field cannot be empty !", success: false });
    }

    if (password !== repeatPassword) {
      return res
        .status(403)
        .json({ message: "Passwords does not match", success: false });
    }

    const account = await accountModel.findOne({ otp: otp });
    if (!account) {
      return res
        .status(404)
        .json({ message: "Password reset failed", success: false });
    }

    account.password = password;
    account.otp = "";
    account.otpExpireDate = "";

    await account.save();

    return res
      .status(200)
      .json({ message: "Password reset complete", success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error occured !", success: false, error: err.message });
  }
};

module.exports = {
  createAccount,
  loginAccount,
  forgetPasword,
  verifyOtp,
  resetPassword,
};
