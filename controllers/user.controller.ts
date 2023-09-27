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
import { userinfra } from "../@types/coustom";
import { IpcNetConnectOpts } from "net";
import cloudinary from "cloudinary"
import { json } from "stream/consumers";
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
    let userid=req.user?._id  as string
     redis.del(userid)  
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
     req.user=user  as userinfra
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


// get user by info by id

export const getuserById=async(req:Request,res:Response,next:NextFunction)=>{
    try {
const userid=req.user?._id as string
    const user=await redis.get(userid)

    if(user){
        const datauser=JSON.parse(user)
        res.status(201).json({
            success:true,
            datauser
        })
    }

    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
  
}

// social auth

interface Isocialauth{
    email:string,
    name:string,
    avatar:string
}

export const socialAuth=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {email,name,avatar}=req.body as Isocialauth
        const user=await UserModel.findOne({email})
        if(!user){
            const newuser=await UserModel.create({email,name,avatar})
            sendtoken(newuser,200,res)
        }else{
            sendtoken(user,200,res)
        }
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}



// update user info

interface Iupdateuser{
    name?:string,
    email?:string
}

export const UpdateUserInfo=async(req:Request,res:Response,next:NextFunction)=>{
    try {
       const {email,name}=req.body as Iupdateuser
       const userId=req.user?._id as string
       const user=await UserModel.findById(userId)
       if(email && user){
        const isEmailExist=await UserModel.findOne({email})
        if(isEmailExist){
            return next(new ErrorHandling("Email is already exist",400))
        }
        user.email=email
       }
       if(name && user){
        user.name=name
       }
    await user?.save()

    await redis.set(userId,JSON.stringify(user))
    res.status(201).json({
        succues:true,
        user
    })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}



// updated user Password

interface IupdatedPassword{
    oldpassword:string,
    newpassword:string,
}

export const updatedPassword=async(req:Request,res:Response,next:NextFunction)=>{
    try {
      const {oldpassword,newpassword}=req.body as IupdatedPassword
  if(!oldpassword || !newpassword){
    return next(new ErrorHandling("please enter old and new password User",400))
  }
      const user=await UserModel.findById({_id:req.user?._id}).select("+password") as IUser
      console.log(user)
      if(user?.password ==="undefined"){
        return next(new ErrorHandling("Invalid User",400))
      }
      const ispassword=await user?.comparePassword(oldpassword)
      if(!ispassword){
        return next(new ErrorHandling("Invaild Old Password",400))
      }
    
        user.password=newpassword 
       
        await user.save()
        if(user){
            const userid=req.user?._id as string
            await redis.set(userid,JSON.stringify(user))
        }
    
      res.status(201).json({
        succues:true,
        user
    })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}

// user profile picture 

interface Iprofie {
    avatar:string
}

export const UpdateUserAvatar=async(req:Request,res:Response,next:NextFunction)=>{
    try {
 const {avatar}=req.body as Iprofie
 const userId=req.user?._id as string
 const user=await UserModel.findById(userId)
 if(avatar && user){
    if(user?.avatar?.public_id){
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)

        const mycloud=await cloudinary.v2.uploader.upload(avatar,{
            folder:"avatar",
            width:150
        })

        user.avatar={
            public_id:mycloud.public_id,
            url:mycloud.secure_url
        }
    }else{
        const mycloud=await cloudinary.v2.uploader.upload(avatar,{
            folder:"avatar",
            width:150
        })

        user.avatar={
            public_id:mycloud.public_id,
            url:mycloud.secure_url
        }
    }
 }

 await user?.save()
 await redis.set(userId,JSON.stringify(user))
      res.status(201).json({
        succues:true,
        user
    })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}


// get all user --- only for admin

export const getAllUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
 const users=await UserModel.find().sort({createdAt:-1})

      res.status(201).json({
        succues:true,
        users
    })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}


// change role --only ad min

export const UpdateRole=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {userId,role}=req.body
     const users=await UserModel.findByIdAndUpdate(userId,{role},{new:true})
             res.status(201).json({
               succues:true,
               users
           })
           } catch (error:any) {
               return next(new ErrorHandling(error.message,400))
           }
}

// only for admin
export const deleteUser=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id}=req.params;
     const users=await UserModel.findById(id)
     if(!users){
        return next(new ErrorHandling("user not found",400))
     }

     await users.deleteOne({id})

     await redis.del(id)


             res.status(201).json({
               succues:true,
               message:"User deleted sucessfully"
           })
           } catch (error:any) {
               return next(new ErrorHandling(error.message,400))
           }
}