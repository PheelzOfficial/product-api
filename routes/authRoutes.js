const express = require("express")
const router = express.Router()
const {createAccount, loginAccount, forgetPasword, verifyOtp, resetPassword} = require("../controllers/auth")

router.post("/register", createAccount)
router.post("/login", loginAccount)
router.post("/forget-password", forgetPasword)
router.post("/verify-otp", verifyOtp)
router.post("/reset-passsword/:otp", resetPassword)


module.exports = router