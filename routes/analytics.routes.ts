import express from "express"
import { authorizeRoles, isAuthticated } from "../middleware/auth"
import { getcourseAnalytics, getorderAnalytics, getuserAnalytics } from "../controllers/analytics.controller"

export const analyticsRouter=express.Router()

analyticsRouter.get("/get-user-analytics",isAuthticated,authorizeRoles("admin"),getuserAnalytics)
analyticsRouter.get("/get-course-analytics",isAuthticated,authorizeRoles("admin"),getcourseAnalytics)
analyticsRouter.get("/get-order-analytics",isAuthticated,authorizeRoles("admin"),getorderAnalytics)