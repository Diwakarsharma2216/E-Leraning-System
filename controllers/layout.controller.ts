import { NextFunction,Request,Response} from "express";
import ErrorHandling from "../utlis/ErrorHandling";
import LayoutModel from "../model/layout.model";
import cloudinary from "cloudinary"

/// create layout
export const createLayout=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {type}=req.body

        const isTypeExist=await LayoutModel.findOne({type})
        if(isTypeExist){
            return  next(new ErrorHandling(`${type} already exists` ,400))
        }

        if(type === "Banner"){
            const {image,title,subTitle}=req.body
            const mycloud=await cloudinary.v2.uploader.upload(image,{
                folder:"layout",
            })

            const banner={
                image:{
                    public_id:mycloud.public_id,
                    url:mycloud.secure_url
                },
                title,
                subTitle
            }
            await LayoutModel.create(banner)
        }

        if(type==="Categories"){
            const {categories}=req.body
            const categoriesItem=await Promise.all(
                categories.map((item:any)=>{
                   return {
                    title:item.title
                   } 
                })
            )

            await LayoutModel.create({
                type:"Categories",
                categories:categoriesItem
            })
        }

        if(type==="FAQ"){
            const {faq}=req.body
            const faqItem=await Promise.all(
                faq.map((item:any)=>{
                   return {
                    question:item.question,
                    answer:item.answer
                   } 
                })
            )

            await LayoutModel.create({
                type:"FAQ",
                faq:faqItem
            })
        }
  res.status(201).json({
    succes:true,
    message:"Layout created Succesfully"
  })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}

//  update layout

export const updateLayout=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {type}=req.body

       
        if(type === "Banner"){
            const {image,title,subTitle}=req.body
            const bannerdata:any=await LayoutModel.findOne({type:"Banner"})
            if(bannerdata){
                await cloudinary.v2.uploader.destroy(bannerdata?.image.public_id)
            }
            const mycloud=await cloudinary.v2.uploader.upload(image,{
                folder:"layout",
            })

            const banner={
                image:{
                    public_id:mycloud.public_id,
                    url:mycloud.secure_url
                },
                title,
                subTitle
            }
            await LayoutModel.findByIdAndUpdate(bannerdata._id,{banner})
        }

        if(type==="Categories"){
            const {categories}=req.body
            const categoriesdata=await LayoutModel.findOne({type:"Categories"})
            const categoriesItem=await Promise.all(
                categories.map((item:any)=>{
                   return {
                    title:item.title
                   } 
                })
            )

            await LayoutModel.findByIdAndUpdate(categoriesdata?._id,{
                type:"Categories",
                categories:categoriesItem
            })
        }

        if(type==="FAQ"){
            const {faq}=req.body 
            const faqdata=await LayoutModel.findOne({type:"FAQ"})

            const faqItem=await Promise.all(
                faq.map((item:any)=>{
                   return {
                    question:item.question,
                    answer:item.answer
                   } 
                })
            )

            await LayoutModel.findByIdAndUpdate(faqdata?._id,{type:"FAQ",faq:faqItem})
        }
  res.status(201).json({
    succes:true,
    message:"Layout created Succesfully"
  })
    } catch (error:any) {
        return next(new ErrorHandling(error.message,400))
    }
}