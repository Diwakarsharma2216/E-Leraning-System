
import  express  from "express";
import { activateUser, loginuser, logoutUser, registrationUser, updateAccesToken } from "../controllers/user.controller";
import { isAuthticated } from "../middleware/auth";

const userRouter=express.Router()

userRouter.post("/registration",registrationUser)
// otp verifican
userRouter.post("/activate-User",activateUser)

// login routes 
userRouter.post("/login",loginuser)


// logout routes
userRouter.get("/logout",isAuthticated,logoutUser)


userRouter.get("/refreshtoken",updateAccesToken)


export default userRouter