import express from "express"
import { authorizeRoles, isAuthticated } from "../middleware/auth"
import { createLayout, updateLayout } from "../controllers/layout.controller"

export const LayoutRouter=express.Router()

LayoutRouter.post("/created-layout",isAuthticated,authorizeRoles("admin"),createLayout)

// update layout
LayoutRouter.put("/update-layout",isAuthticated,authorizeRoles("admin"),updateLayout)


