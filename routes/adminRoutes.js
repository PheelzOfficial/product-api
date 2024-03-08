const express = require("express");
const router = express.Router();
const { postProduct, deleteProduct, updateProduct } = require("../controllers/admin");
const { uploadMiddleware } = require("../middlewares/upload")
const { verify } = require("../middlewares/verifyToken");

router.delete("/delete/:productId", verify, deleteProduct);
router.post("/post", verify, uploadMiddleware, postProduct);
router.patch("/update/:productId", verify, updateProduct);

module.exports = router;
