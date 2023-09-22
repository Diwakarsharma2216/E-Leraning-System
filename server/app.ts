import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
require("dotenv").config()
import cookieParser from "cookie-parser"
import { middlewareErrorHandle } from "./middleware/error"
import userRouter from "./routes/user.routes"

export const app=express()

//body parser
app.use(express.json({limit:"50mb"}))

//cookie parser
app.use(cookieParser())

// cors 
app.use(cors({
    origin:process.env.ORIGIN
}));

//user router

app.use("/user",userRouter)

// test api
app.get("/test",(req:Request,res:Response,next:NextFunction)=>{
res.status(200).json({
    success:true,
    message:"API is Working"
})
})

// unkown route
app.all("*",(req:Request,res:Response,next:NextFunction)=>{
    const err =new Error(`Routes ${req.originalUrl} not found` ) as any;
    err.statusCode=404
    next(err)
})


app.use(middlewareErrorHandle)