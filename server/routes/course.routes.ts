import  express  from "express";
import { AddReplyToTreview, EditCourse, GetAllCourse, GetSingleCourse, addAnswer, addQuestion, addReveiw, deleteCourse, getAllCourseForAdmin, getCourseByuser, uploadCourse } from "../controllers/course.controller";
import { authorizeRoles, isAuthticated } from "../middleware/auth";

export const CourseRouter=express.Router()


// create course
CourseRouter.post("/create-course",isAuthticated,authorizeRoles("admin"),uploadCourse)


// update course
CourseRouter.put("/update-course/:id",isAuthticated,authorizeRoles("admin"),EditCourse)

// get single courser data without --purchase

CourseRouter.get("/get-course/:id",GetSingleCourse)

// get all course data whithout -- purchase
CourseRouter.get("/get-allcourse",GetAllCourse)

// get course for valid user

CourseRouter.get("/get-course-content/:id",isAuthticated,getCourseByuser)

// add question
CourseRouter.put("/add-question",isAuthticated,addQuestion)

// add answer
CourseRouter.put("/add-answer",isAuthticated,addAnswer)


// add reveiw
CourseRouter.put("/add-review/:id",isAuthticated,addReveiw)
// reviw reply
CourseRouter.put("/add-review-reply",isAuthticated,authorizeRoles("admin"),AddReplyToTreview)


// get all course for admin
CourseRouter.get("/get-allcourse-admin",isAuthticated,authorizeRoles("admin"),getAllCourseForAdmin)
// delete course only for add min
CourseRouter.delete("/delete-course/:id",isAuthticated,authorizeRoles("admin"),deleteCourse)

