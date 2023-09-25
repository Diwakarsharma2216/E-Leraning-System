import { NextFunction, Request,Response } from "express";
import ErrorHandling from "../utlis/ErrorHandling";
import cloudinary from "cloudinary"
import CourseModel from "../model/course.model";
import { redis } from "../utlis/redis";

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
    