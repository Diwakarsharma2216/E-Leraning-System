import  jwt, { JwtPayload, Secret }  from "jsonwebtoken";
require("dotenv").config()
import console from "console";
import { NextFunction, Request,Response } from "express";
import ErrorHandling from "../utlis/ErrorHandling";
import { IUser, UserModel } from "../model/user.model";
import path from "path";
import ejs from "ejs"
import sendMail from "../utlis/sendMail";
import { CatchAsyncError } from "../middleware/catchayncerror";
import { accesTokenOption, refreshTokenOption, sendtoken } from "../utlis/jwt";
import { redis } from "../utlis/redis";
interface IregistrationBody{
    name:string;
    email:string;
    password:string;
    avatar?:string
}


export const registrationUser=async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {name,email,password}=req.body
        const isEmailexist=await UserModel.findOne({email})

        if(isEmailexist){
            return next(new ErrorHandling("Email alredy exist",400))
        }
const user:IregistrationBody={
    name,email,password
}

const activationToken=CreateActivationToken(user)

const activationCode=activationToken.activationCode
const data={user:{name:user.name},activationCode}

const html=await ejs.renderFile(path.join(__dirname,"../mails/activation-mail.ejs"),data)
        try {
        await sendMail({
            email:user.email,
            subject:"Activation Email",
            template:"activation-mail.ejs",
            data
        })   
        
        res.status(201).json({
            success:true,
            message:`Please check your email ${user.email} to activate your account`,
            activationToken:activationToken
        })
        } catch (error:any) {
            return next(new ErrorHandling(error.message,400))
        }
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}

interface IActivationToken{
    token:string;
    activationCode:string
}


export const CreateActivationToken=(user:any):IActivationToken =>{
const activationCode=Math.floor(1000+Math.random()*9000).toString()
    const token=jwt.sign({
 user,activationCode
    },process.env.ACTIVATION_SECRET as Secret,{ expiresIn: '5m' })

return {token,activationCode}
}

// active user

interface IActiveRequest{
    token:string,
    activationCode:string
}

export const activateUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {token,activationCode}=req.body as IActivationToken
       const newUser=jwt.verify(token,process.env.ACTIVATION_SECRET as string) as {user:IUser,activationCode:string}
    if(newUser.activationCode!==activationCode){
    return next(new ErrorHandling("Invalid activation code",400))
    }
 
    const {name,email,password}=newUser.user
    const existinguser=await UserModel.findOne({email})
if(existinguser){
    return next(new ErrorHandling("Email is al ready exsit",400))
}

const user=await UserModel.create({name,email,password})
res.status(201).json({
    success:true,
    user
})
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}  


// login user

interface ILoginuser{
    email:string,
    password:string
}


export const loginuser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {email,password}=req.body as ILoginuser
        if(!email || !password){
            return next(new ErrorHandling("Please enter email and password",400))
        }
        
        const user=await UserModel.findOne({email}).select("+password")

        if(!user){
            return next(new ErrorHandling("Invalid Email || Passsword",400))
        }
        const ispassword=await  user.comparePassword(password)
        if(!ispassword){
            return next(new ErrorHandling("Invalid Passsword",400))
        }

        sendtoken(user,200,res)
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}

// logout user

export const logoutUser=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    res.cookie("access_token","",{maxAge:1})
    res.cookie("refresh_token","",{maxAge:1})
    // let userid=req.user?._id      
    //  redis.del(userid)  
    res.status(200).json({
        success:true,
        message:"Logged out succesfully"
    })
  } catch (error:any) {
    return next(new ErrorHandling(error.message,400))
  }
}

// update access token 

export const updateAccesToken=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const refresh_token=req.cookies.access_token
        const decoded =jwt.verify(refresh_token,process.env.REFRESH_TOKEN as Secret) as JwtPayload

        if(!decoded){
            return next(new ErrorHandling("Could Not Refresh Token",400))
        }

        const session =await redis.get(decoded.id as string)

        if(!session){
            return next(new ErrorHandling("Could Not Refresh Token",400))
        }
     const user=JSON.parse(session)

     const accesToken=jwt.sign({id:user._id},process.env.ACCES_TOKEN as Secret,{expiresIn:"5m"})

      const refreshToken=jwt.sign({id:user._id},process.env.REFRESH_TOKEN as Secret,{expiresIn:"3d"})
 
      res.cookie("access_token",accesToken,accesTokenOption)
      res.cookie("refresh_token",refreshToken,refreshTokenOption)
      res.status(200).json({
          success:true,
          accesToken
      })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}


// get user by id

// export const getuserById=async(req:Request,res:Response,next:NextFunction)=>{
//     try {
// const userid=req.user?.id
//     const user=await UserModel.findById(userid)

//         res.status(201).json({
//             success:true,
//             user
//         })
//     } catch (error:any) {
//         return next(new ErrorHandling(error.message,400))
//     }
  
// }