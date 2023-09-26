import express from "express"
import { authorizeRoles, isAuthticated } from "../middleware/auth"
import {  getAllNotification, updateNotification } from "../controllers/notification.controller"
export const NotificationRouter=express.Router()

// get notification
NotificationRouter.get("/get-all-notification",isAuthticated,authorizeRoles("admin"),getAllNotification)

// update notification
NotificationRouter.put("/update-notification/:id",isAuthticated,authorizeRoles("admin"),updateNotification)

