const express = require("express")
const Efileupload = require("express-fileupload")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
require("dotenv").config()
const app = express()
const mongourl = process.env.MONGO_URL
const userAuth = require("./routes/authRoutes")
const admin = require("./routes/adminRoutes")
const userRoutes = require("./routes/userRoutes")
const path = require("path")
const cors = require("cors")

mongoose.connect(mongourl).then(()=>{
    console.log("DB connected successfully")
}).catch((err)=>{
    console.log(err.message)
})


app.use(Efileupload())
app.use(cookieParser())
app.use(cors())
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/api/v1", userAuth)
app.use("/api/v1", admin)
app.use("/api/v1", userRoutes)

app.get("/", (req, res)=>{
    const hostname = `${req.protocol}://${req.get('host')}`;
    res.send(`<h1>This API is currently running on ${hostname}</h1>`)
})


const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`server listening on port ${port}`)
})