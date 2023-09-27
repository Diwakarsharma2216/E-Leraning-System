require("dotenv").config()
import mongoose from "mongoose"
const dbURL:string=process.env.DB_URL || ""

 const connectDB=async ()=>{
    try {
        await mongoose.connect(dbURL).then((data:any)=>{
            console.log(`Database Connected With ${data.connection.host}`)
        })
    } catch (error:any) {
        console.log(error.message)
       
        
    }
}
export default connectDB