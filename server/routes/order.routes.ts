// createOrder
import express from "express"
import { isAuthticated } from "../middleware/auth"
import { createOrder } from "../controllers/order.controller"
 const OrderRouter=express.Router()

OrderRouter.post("/create-order",isAuthticated,createOrder)

export default OrderRouter