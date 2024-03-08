const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { imageValidation, produtValidation } = require("../middlewares/validate");
const accountModel = require("../models/accountModel");

const uploadMiddleware = async (req, res, next) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const account = await accountModel.findOne({ _id: userId });
      if (account.role === "admin") {
        const { error: imageError } = imageValidation(req.files.image);
        const { error: productError } = produtValidation(req.body);
        if (imageError || productError) {
          return res.status(400).json({ message: imageError?.details[0].message || productError?.details[0].message, success: false });
        }
        const images = req.files.images;
        const hostname = `${req.protocol}://${req.get("host")}`;
        const imageArr = [];

        if (Array.isArray(images)) {
          await Promise.all(
            images.map(async (image) => {
              const uniqueName = generateUniqueName(image.name);
              const localFilePath = path.join(
                process.cwd(),
                "public",
                "uploads",
                uniqueName
              );
              await image.mv(localFilePath);
              const fileupload = `${hostname}/public/uploads/${uniqueName}`;
              imageArr.push(fileupload);
            })
          );
        } else {
          const uniqueName = generateUniqueName(images.name);
          const localFilePath = path.join(
            process.cwd(),
            "public",
            "uploads",
            uniqueName
          );
          await images.mv(localFilePath);
          const fileupload = `${hostname}/public/uploads/${uniqueName}`;
          imageArr.push(fileupload);
        }

        req.imageArr = imageArr;
        next();
      } else {
        return res.status(400).json({
          message: "Access denied, you are not an admin",
          success: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Access denied",
        success: false,
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: "Error occurred while handling file uploads",
      success: false,
      error: err.message,
    });
  }
};

const generateUniqueName = (originalName) => {
  const fileExtension = originalName.split(".").pop();
  const uniqueName = `${uuidv4()}.${fileExtension}`;
  return uniqueName;
};

module.exports = { uploadMiddleware };
