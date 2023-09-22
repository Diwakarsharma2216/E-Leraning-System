import { app } from "./app";
import  connectDB  from "./utlis/db";
require("dotenv").config()
app.listen(process.env.PORT,()=>{
    console.log(`server is connected at ${process.env.PORT}`)
    connectDB()
})