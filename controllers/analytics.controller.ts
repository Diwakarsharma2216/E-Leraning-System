// get users analytics ---- only for admin

import { NextFunction, Request, Response } from "express";
import ErrorHandling from "../utlis/ErrorHandling";
import { generateLast12Monthdata } from "../utlis/anatytics.generator";
import { UserModel } from "../model/user.model";
import CourseModel from "../model/course.model";
import OrderModel from "../model/order.model";

export const getuserAnalytics=async(req:Request,res:Response,next:NextFunction)=>{
    try {
           const users=await generateLast12Monthdata(UserModel)
           res.status(201).json({
            succes:true,
            users
           })
           } catch (error:any) {
               return next(new ErrorHandling(error.message,400))
           }
}

export const getcourseAnalytics=async(req:Request,res:Response,next:NextFunction)=>{
    try {
           const course=await generateLast12Monthdata(CourseModel)
           res.status(201).json({
            succes:true,
            course
           })
           } catch (error:any) {
               return next(new ErrorHandling(error.message,400))
           }
}


export const getorderAnalytics=async(req:Request,res:Response,next:NextFunction)=>{
    try {
           const order=await generateLast12Monthdata(OrderModel)
           res.status(201).json({
            succes:true,
            order
           })
           } catch (error:any) {
               return next(new ErrorHandling(error.message,400))
           }
}