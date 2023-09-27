import { Model,Document } from "mongoose";

interface MonthData{
    month:string,
    count:number,
}

export async function generateLast12Monthdata<T extends Document>(model:Model<T>):Promise<{last12Months:MonthData[]}> {
   const last12Months:MonthData[]=[]
   const currentdate=new Date()
   currentdate.setDate(currentdate.getDate()+1)

   for(let i=11;i>=0;i--){
    const endDate=new Date(
        currentdate.getFullYear(),
        currentdate.getMonth(),
        currentdate.getDate()-i*28
    )
    const startDate=new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()-28
    )

    const monthyear=endDate.toLocaleString("default",{
        day:"numeric",
        month:"short",
        year:"numeric"
    })
    const count=await model.countDocuments({
        createdAt:{
            $gte:startDate,
            $lt:endDate
        }
    })
    last12Months.push({month:monthyear,count})
   }
   return {last12Months}
}