const accountModel = require("../models/accountModel");
const productModel = require("../models/productModel");
const { produtValidation } = require("../middlewares/validate");

const postProduct = async (req, res) => {
  try {
    if (req.user) {
      const filepath = req.imageArr;
      const accountid = req.user.id;
      const check = await accountModel.findOne({ _id: accountid });
      if (check.role === "admin") {
        const { error } = produtValidation(req.body);
        if (error) {
          return res
            .status(400)
            .json({ message: error.details[0].message, success: false });
        }

        const { title, price, description, category } = req.body;

        await productModel.create({
          title: title,
          price: price,
          postedBy: check._id,
          description: description,
          category: category,
          images: filepath,
        });

        return res
          .status(201)
          .json({ message: "Upload successful", success: true });
      } else {
        return res.status(401).json({
          message: "Unauthorized,You are not an admin",
          success: false,
        });
      }
    } else {
      return res.status(401).json({
        message: "Access Denied, you are not logged in",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Error occured !",
      success: false,
      error: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const account = await accountModel.findOne({ _id: userId });

      if (account.role === "admin") {
        const deleteId = req.params.productId;
        const checkproduct = await productModel.findOne({
          productId: deleteId,
        });
        if (!checkproduct) {
          return res
            .status(404)
            .json({ message: "Product does not exist !", success: false });
        }

        await productModel.findByIdAndDelete(checkproduct._id);

        return res
          .status(200)
          .json({ message: "Product deleted successfully", success: true });
      } else {
        return res.status(401).json({
          message: "Access denied, you are not and admin",
          success: false,
        });
      }
    } else {
      return res
      .status(401)
      .json({ message: "You are not authorized", success: false });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Error occured",
      success: false,
      error: err.message
    });
  }
};

const updateProduct = async(req, res)=>{
  try {
    if (req.user) {
      const userId = req.user.id;
      const account = await accountModel.findOne({ _id: userId });

      if (account.role === "admin") {
        const updateId = req.params.productId;
        const checkproduct = await productModel.findOne({
          productId: updateId,
        });
        if (!checkproduct) {
          return res
            .status(404)
            .json({ message: "Product does not exist !", success: false });
        }

        const {title, description, price} = req.body
        if(title){
          checkproduct.title = title
        }

        if(description){
          checkproduct.description = description
        }
        if(price){
          checkproduct.price = price
        }

        await checkproduct.save()

        return res
          .status(200)
          .json({ message: "Product updated successfully", success: true });
      } else {
        return res.status(401).json({
          message: "Access denied, you are not and admin",
          success: false,
        });
      }
    } else {
      return res
      .status(401)
      .json({ message: "You are not authorized", success: false });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Error occured",
      success: false,
      error: err.message
    });
  }
}

module.exports = { postProduct, deleteProduct, updateProduct };
