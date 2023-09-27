import { NextFunction, Request,Response } from "express";
import ErrorHandling from "../utlis/ErrorHandling";
import cloudinary from "cloudinary"
import CourseModel from "../model/course.model";
import { redis } from "../utlis/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs"
import sendMail from "../utlis/sendMail";
import notificationModel from "../model/notification.model";

// crate course
export const uploadCourse=async(req:Request,res:Response,next:NextFunction)=>{
try {
    const data=req.body;
    const thumbnail=data.thumbnail
    if(thumbnail){
        const mycloud=await cloudinary.v2.uploader.upload(thumbnail,{
            folder:"courses"
        })
     data.thumbnail={
        public_id:mycloud.public_id,
        url:mycloud.secure_url
     }

    }

 let course = await CourseModel.create(data)
    res.status(201).json({
        success:true,
        course
    })
} catch (error:any) {
    return next(new ErrorHandling(error.message,400))
}
}


// edit course 
export const EditCourse=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=req.body;
        const thumbnail=data.thumbnail
        if(thumbnail){
            const mycloud=await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"courses"
            })
         data.thumbnail={
            public_id:mycloud.public_id,
            url:mycloud.secure_url
         }
    
        }
    
   const courseId=req.params.id
   const course =await CourseModel.findByIdAndUpdate(courseId,{$set:data},{new:true})
        res.status(201).json({
            success:true,
            course
        })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
    }

    // get single course --- without purchase 

    export const GetSingleCourse=async(req:Request,res:Response,next:NextFunction)=>{
        try {
          const courseId=req.params?.id
          const isCacheExist=await redis.get(courseId)
          if(isCacheExist){
            console.log("hiited redis+!")
          const course=JSON.parse(isCacheExist)
          res.status(201).json({
            success:true,
            course
        })
          }else{
            const course=await CourseModel.findById(req.params?.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -questions.links")
            await redis.set(courseId,JSON.stringify(course))
         
            res.status(201).json({
                success:true,
                course
            })
          }
     
        } catch (error:any) {
            return next(new ErrorHandling(error.message,400))
        }
        }
    
        //  get all course --- without purchasing

        export const GetAllCourse=async(req:Request,res:Response,next:NextFunction)=>{
            try {
                const isCacheExist=await redis.get("allCourses")
                if(isCacheExist){
                  const course=JSON.parse(isCacheExist)
                  console.log("hitting redis")
                  res.status(201).json({
                    success:true,
                    course
                })
                  }else{
                    const course=await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -questions.links")
                    await  redis.set("allCourses",JSON.stringify(course))
                    console.log("hitting mongos")
                    res.status(201).json({
                        success:true,
                        course
                    })
                  }
       
            } catch (error:any) {
                return next(new ErrorHandling(error.message,400))
            }
            }


            // get course content -- only for  valid user

            export const getCourseByuser=async(req:Request,res:Response,next:NextFunction)=>{
                try {
                    const userCourseList=req.user?.courses
                    const courseId=req.params?.id
                    const courseExists=userCourseList?.find((course:any)=>course._id.toString()===courseId)
                   if(!courseExists){
                    return next(new ErrorHandling("You are not eligibal to acces this course",400)) 
                   }
                   const course=await CourseModel.findById(courseId)
                   const content=course?.courseData
                        res.status(201).json({
                            success:true,
                            content
                        })
                      
           
                } catch (error:any) {
                    return next(new ErrorHandling(error.message,400))
                }
                }
    
                // add question in course
                interface IAddQuestion{
                    question:string,
                    courseId:string,
                    contentId:string
                }

                export const addQuestion=async(req:Request,res:Response,next:NextFunction)=>{
                    try {
                      const {question,courseId,contentId}:IAddQuestion=req.body
                      const course =await CourseModel.findById(courseId)
                      
                      if(!mongoose.Types.ObjectId.isValid(contentId)){
                        return  next(new ErrorHandling("Invalid course id",400))
                      }

                      const courseContent=course?.courseData?.find((item:any)=>item._id.equals(contentId))
                      if(!courseContent){
                        return  next(new ErrorHandling("Invalid content id",400))
                      }

                      // create a new question object
                      const newQuestion:any={
                        user:req.user,
                        question,
                        questionReplies:[]
                      }

                      // add this question to our course content
                      courseContent.questions.push(newQuestion)
                      
                      // notification to the admin 
                     await notificationModel.create({
                        user:req.user?._id,
                        title:"New Question",
                        message:`You have a new question in ${courseContent?.title}`
                     })

                      await course?.save()
                      
                      res.status(201).json({
                        success:true,
                        course
                    })
                    } catch (error:any) {
                        return next(new ErrorHandling(error.message,400))
                    }
                    }

        // <<<<<<<<<<<<add answer in course question >>>>>>>>>>>>>>>>>>>>>>>>>

        interface IADAnswerData{
            answer:string,
            courseId:string,
            contentId:string,
            questionId:string
        }

        export const addAnswer=async(req:Request,res:Response,next:NextFunction)=>{
            try {
            const {answer,courseId,contentId,questionId}:IADAnswerData=req.body
            const course=await CourseModel.findById(courseId)
            if(!mongoose.Types.ObjectId.isValid(contentId)){
                return next(new ErrorHandling("Invalid content id",400))
            }
   const courseContent=course?.courseData?.find((item:any)=>item._id.equals(contentId))
           
   if(!courseContent){
    return next(new ErrorHandling("Invalid Content Id",400))
   }

   const question=courseContent?.questions?.find((item:any)=>item._id.equals(questionId))
   if(!question){
    return next(new ErrorHandling("Invalid Question Id",400))
   }
   
   // create a new answer object
   const newAnswer:any={
    user:req.user,
    answer
   }

   question.questionReplies?.push(newAnswer)
   await course?.save()
   if(req.user?._id===question.user?._id){
    //  create a notification to admin to ans user question 
    await notificationModel.create({
        user:req.user?._id,
        title:"New Question Reply Received",
        message:`You have a new question reply in ${courseContent?.title}`
     })
   }else{
    const data={
        name:question.user.name,
        title:courseContent.title,
    }
    const html=await ejs.renderFile(path.join(__dirname,"../mails/question-reply.ejs"),data)
    try {
        await sendMail({
            email:question.user.email,
            subject:"Question Reply",
            template:"question-reply.ejs",
            data
        })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
   }
   res.status(200).json({
    success:true,
    course
   })
            } catch (error:any) {
                return next(new ErrorHandling(error.message,400))
            }
            }

//  add review in course 
interface IAddReviewData{
    review:string,
    rating:number,
    userId:string
}


export const addReveiw=async(req:Request,res:Response,next:NextFunction)=>{
    try {
     const userCourseList=req.user?.courses
 const courseId=req.params.id;

 // check if courseid alreday exists in usercourseList based on _id
 const courseExist=userCourseList?.some((course:any)=>course._id.toString()===courseId)
 if(courseExist){
    return next(new ErrorHandling("Your are not Eligible to acces this course",400))
 }

 const course=await CourseModel.findById(courseId)
 const {review,rating}=req.body as IAddReviewData

 const reviwData:any={
    user:req.user,
    comment:review,
    rating
 }

 course?.reviews.push(reviwData)
 await course?.save()

 let avg=0;

 course?.reviews.forEach((rev:any)=>{
    avg+=rev.rating
 })


 const notification={
    title:"New Review Received",
    message:`${req.user?.name} has given a review in ${course?.name}`
 }

 res.status(200).json({
    succes:true,
    course
 })

    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
    }


    // reply to the review only user is reply

    export const AddReplyToTreview=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {comment,courseId,reviewId}=req.body
    const course=await CourseModel.findById(courseId)
    if(!course){
        return next(new ErrorHandling("course not found",400))
    }
    const review=course?.reviews.find((rev:any)=>rev._id.toString()===reviewId)
    if(!review){
        return next(new ErrorHandling("Review not found",400))
    }

    const replydata:any={
        user:req.user,
        comment
    }
    if(!review.commentReplies){
        review.commentReplies=[]
    }
    review.commentReplies?.push(replydata)

    await course?.save()

    res.status(200).json({
        succes:true,
        course
     })

        } catch (error:any) {
            return next(new ErrorHandling(error.message,400))
        }
    }


    // get all courses only for admin
    

    export const getAllCourseForAdmin=async(req:Request,res:Response,next:NextFunction)=>{
        try {
     const courses=await CourseModel.find().sort({createdAt:-1})
    
          res.status(201).json({
            succues:true,
            courses
        })
        } catch (error:any) {
            return next(new ErrorHandling(error.message,400))
        }
    }


    // only for admin
export const deleteCourse=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id}=req.params;
     const course=await CourseModel.findById(id)
     if(!course){
        return next(new ErrorHandling("course not found",400))
     }

     await course.deleteOne({id})

     await redis.del(id)


             res.status(201).json({
               succues:true,
               message:"course deleted sucessfully"
           })
           } catch (error:any) {
               return next(new ErrorHandling(error.message,400))
           }
}