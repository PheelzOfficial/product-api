const express = require("express")
const router = express.Router()
const {fetchProducts, forgetPassword} = require("../controllers/user")

router.get("/products", fetchProducts)
router.post("/forget-password", forgetPassword)


module.exports = router