const accountModel = require("../models/accountModel");
const productModel = require("../models/productModel");
const {generateOtp} = require("../middlewares/otpgenerator")
const {MailSending} = require("../middlewares/email")


const fetchProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("postedBy");
    if (products.length === 0 || !products) {
      return res
        .status(404)
        .json({ message: "Products not found !", success: false });
    }

    return res
      .status(200)
      .json({
        message: "Products successfully found !",
        success: true,
        products,
      });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: "Error occurred !",
      success: false,
      error: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email can not be empty", success: false });
    }

    const account = await accountModel.findOne({ email: email });
    if(!account){
      return res
        .status(404)
        .json({ message: "Email not found !", success: false });
    }

    const generate = await generateOtp()
    account.otp = generate
    const date = new Date()
    date.setMinutes(date.getMinutes()+ 10)
    account.otpExpireDate = date

    await account.save()

    const subject = "Account OTP code"
    const message = `Below is your otp code \n ${generate} and this code code expires in 10 minutes`
    const option = {
      subject: subject,
      message: message,
      email: email
    }
     await MailSending(option)

    return res.status(200).json({message: "Mail sent, check your inbox", success: true, })

  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: "Error occurred !",
      success: false,
      error: err.message,
    });
  }
};

module.exports = { fetchProducts, forgetPassword };
