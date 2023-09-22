import {Request, NextFunction, Response } from "express";
import ErrorHandling from "../utlis/ErrorHandling";

export const middlewareErrorHandle=(err:any,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode=err.statusCode || 500
    err.message=err.message || "Internal server error"

    // wrong mongodb id error

    if(err.name==="CastError"){
        const message=`Rescources not found .Invaild ${err.path}`
        err=new ErrorHandling(message,400)
    }

    // duplicate key Error

    if(err.code==="11000"){
        const message=`Duplicate ${Object.keys(err.keyValue)} entered`
        err=new ErrorHandling(message,400)
    }
    // wrong jwt Error


    if(err.name==="JsonWebTokenError"){
        const message=`Invaild Token`
        err=new ErrorHandling(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}