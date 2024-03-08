const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


const accountSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
    },
    role:{
        type: String,
        enum:["user", "admin"],
        default: "user"
    },
    otp:{
        type: String
    },
    otpExpireDate:{
        type: Date
    },
    date: {
        type: Date,
        default: Date.now()
    }
})


accountSchema.pre("save", async function(next) {
  const userPassword = this.password  
  const genSalt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(userPassword, genSalt)
  this.password = hashedPassword
  next()
})


module.exports = mongoose.model("Account", accountSchema)