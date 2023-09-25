import { NextFunction,Request,Response} from "express";
import ErrorHandling from "../utlis/ErrorHandling";
import ejs from "ejs"
import { UserModel } from "../model/user.model";
import CourseModel from "../model/course.model";
import path from "path";
import notificationModel from "../model/notification.model";
import sendMail from "../utlis/sendMail";
import OrderModel from "../model/order.model";

export const createOrder=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {courseId,payment_info}=req.body
       
        const user=await UserModel.findById(req.user?._id)

        const courseExists=user?.courses.some((course:any)=>course._id.toString().equals(courseId))

        if(courseExists){
            return next(new ErrorHandling("You have already purchased this course",400))
        }
        const course=await CourseModel.findById(courseId)

        if(!course){
            return next(new ErrorHandling("course not found",400))
        }

        const data:any={
            courseId:course._id,
            userId:req.user?._id,
            payment_info,
        }
       
        const mailData={
           _id:course._id.toString().slice(0,6),
           name:req.user?.name,
           coursename:course.name,
           price:course.price,
           date:new Date().toLocaleDateString("en-us",{year:"numeric",month:"long",day:"numeric"})
        }

        const html=await ejs.renderFile(path.join(__dirname,"../mails/order-conformation.ejs"),mailData)

        try {
            if(user){
                await sendMail({
                    email:user.email,
                    subject:"Order conformation",
                    template:"order-conformation.ejs",
                    data:mailData
                })
            }
        } catch (error:any) {
            return next(new ErrorHandling(error.message,400))
        }

        user?.courses.push(course?._id)
        
        await user?.save()
        await notificationModel.create({
            user:user?._id,
            title:"New Order",
            message:`you have a new order from ${course?.name}`
        })

        course.purchased?course.purchased+=1 :course.purchased
        await course.save()

        await OrderModel.create(data)
        res.status(201).json({
            succes:true,
            Order:course
        })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}