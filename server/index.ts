import { app } from "./app";
import {v2 as cloudinary} from "cloudinary"
import  connectDB  from "./utlis/db";
require("dotenv").config()

// cloudany config
cloudinary.config({
    cloud_name:process.env.ClOUD_NAME,
    api_key:process.env.ClOUD_API_KEY,
    api_secret:process.env.ClOUD_SECRET_KEY
})

app.listen(process.env.PORT,()=>{
    console.log(`server is connected at ${process.env.PORT}`)
    connectDB()
})