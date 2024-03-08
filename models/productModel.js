const mongoose = require("mongoose")
const {v4: uuidv4} = require("uuid")

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    productId:{
        type: String,
        unique: true,
    },
    images:[{type: String}],
    date: {
        type: Date,
        default: Date.now()
    }
})

productSchema.pre("save", function(next){
    if(!this.productId){
        this.productId = uuidv4()
    }

    next()
})



module.exports = mongoose.model("Product", productSchema)
