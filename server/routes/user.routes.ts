
import  express  from "express";
import { UpdateUserAvatar, UpdateUserInfo, activateUser, getuserById, loginuser, logoutUser, registrationUser, socialAuth, updateAccesToken, updatedPassword } from "../controllers/user.controller";
import { isAuthticated } from "../middleware/auth";

const userRouter=express.Router()

userRouter.post("/registration",registrationUser)
// otp verifican
userRouter.post("/activate-User",activateUser)

// login routes 
userRouter.post("/login",loginuser)


// logout routes
userRouter.get("/logout",isAuthticated,logoutUser)

// refresh token
userRouter.get("/refreshtoken",updateAccesToken)

// me 
userRouter.get("/me",isAuthticated,getuserById)

// socail auth

userRouter.post("/social-auth",socialAuth)

// update routes
userRouter.put("/update-user-info",isAuthticated,UpdateUserInfo)
// update user password
userRouter.put("/update-user-password",isAuthticated,updatedPassword)
// update user avatar
userRouter.put("/update-user-avatar",isAuthticated,UpdateUserAvatar)


export default userRouter