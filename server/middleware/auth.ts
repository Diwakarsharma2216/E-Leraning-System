import { Request,NextFunction, Response } from "express";
import ErrorHandling from "../utlis/ErrorHandling";
import  jwt, { JwtPayload, Secret }  from "jsonwebtoken";
require("dotenv").config()
import { redis } from "../utlis/redis";


export const isAuthticated=async(req:Request,res:Response,next:NextFunction)=>{
    const acces_token=req.cookies.access_token

    if(!acces_token){
        return next(new ErrorHandling("Please login to acces this resource",400))
    }

    const decoded=jwt.verify(acces_token,process.env.ACCES_TOKEN as Secret) as JwtPayload
   if(!decoded){
    return next(new ErrorHandling("access token is not valid",400))
   }

const user=await redis.get(decoded.id)

 
if(!user){ 
    return next(new ErrorHandling("user not found",400))
}


// req.user=JSON.parse(user)  
next()
}