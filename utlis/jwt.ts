import { Response } from "express";
import { IUser } from "../model/user.model";
import { redis } from "./redis";
require("dotenv").config()


interface ITokenOptions{
    expires:Date;
    maxAge:number;
    httpOnly:boolean;
    samesite:"lax" | "strict" | "none" | undefined;
    secure?:boolean
} 

const accesTokenExpire=parseInt(process.env.ACCES_TOKEN_EXPIRE || "300")
const refreshTokenExpire=parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200")


export const accesTokenOption:ITokenOptions={
    expires:new Date(Date.now()+accesTokenExpire*60*60*1000),
maxAge:accesTokenExpire*60*60*1000,
httpOnly:true,
samesite:"lax",
}

export const refreshTokenOption:ITokenOptions={
    expires:new Date(Date.now()+accesTokenExpire*24*60*60*1000),
    maxAge:refreshTokenExpire*24*60*60*1000,
    httpOnly:true,
    samesite:"lax",
}
export const sendtoken=(user:IUser,statuscode:number,res:Response)=>{
    const accesToken=user.SignAccesToken()
    const refreshToken=user.SignRefreshToken()

    // upload session to redis

    redis.set(user._id,JSON.stringify(user))

    // only set secure to true in production
    if(process.env.Node_ENV==="production"){
        accesTokenOption.secure=true
    }

    res.cookie("access_token",accesToken,accesTokenOption)
    res.cookie("refresh_token",refreshToken,refreshTokenOption)
    res.status(statuscode).json({
        success:true,
        user,
        accesToken
    })

}