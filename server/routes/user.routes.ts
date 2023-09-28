
import  express  from "express";
import { UpdateRole, UpdateUserAvatar, UpdateUserInfo, activateUser, deleteUser, getAllUser, getuserById, loginuser, logoutUser, registrationUser, socialAuth, updateAccesToken, updatedPassword } from "../controllers/user.controller";
import { authorizeRoles, isAuthticated } from "../middleware/auth";

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


// get all user for ---admin only
userRouter.get("/get-all-user",isAuthticated,authorizeRoles("admin"),getAllUser)

userRouter.put("/update-role",isAuthticated,authorizeRoles("admin"),UpdateRole)

// delete user --only admin
userRouter.delete("/delete-user/:id",isAuthticated,authorizeRoles("admin"),deleteUser)


export default userRouter