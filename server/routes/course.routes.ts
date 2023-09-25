import  express  from "express";
import { EditCourse, GetAllCourse, GetSingleCourse, getCourseByuser, uploadCourse } from "../controllers/course.controller";
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