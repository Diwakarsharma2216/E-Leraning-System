// createOrder
import express from "express"
import { authorizeRoles, isAuthticated } from "../middleware/auth"
import { createOrder, getAllorder } from "../controllers/order.controller"
 const OrderRouter=express.Router()

OrderRouter.post("/create-order",isAuthticated,createOrder)

// get all order -- ony for admin
OrderRouter.get("/get-all-order",isAuthticated,authorizeRoles("admin"),getAllorder)

export default OrderRouter