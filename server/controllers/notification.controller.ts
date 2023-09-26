import { NextFunction, Request, Response } from "express"
import ErrorHandling from "../utlis/ErrorHandling"
import notificationModel from "../model/notification.model"


// get all notification -- only admin
export const getNotification=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const notification=await notificationModel.find().sort({createdAt:-1})
        res.status(201).json({
            succes:true,
            notification
        })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}


// update notification status -- only admin

export const updateNotification=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const notification=await notificationModel.findById(req.params?.id)
        if(!notification){
            return next(new ErrorHandling("Notification not found",400))
        }else{
            notification.status ? (notification.status="read"):notification?.status
        }

        await notification.save()
        const notifications=await notificationModel.find().sort({createdAt:-1})

        res.status(201).json({
            succes:true,
            notifications
        })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}