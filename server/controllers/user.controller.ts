import  jwt, { Secret }  from "jsonwebtoken";
require("dotenv").config()

import { NextFunction, Request,Response } from "express";
import ErrorHandling from "../utlis/ErrorHandling";
import { UserModel } from "../model/user.model";
import path from "path";
import ejs from "ejs"
import sendMail from "../utlis/sendMail";
import { CatchAsyncError } from "../middleware/catchayncerror";
interface IregistrationBody{
    name:string;
    email:string;
    password:string;
    avatar?:string
}


export const registrationUser=CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
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
})

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