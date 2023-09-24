import  {Request} from "express";


export   interface userinfra {
    name:string,
    email:String,
    password:string,
    avatar:{
        public_id:string;
        url:string;
    },
    role:string,
    isVerified:boolean;
    courses:Array<{courseId:String}>
    comparePassword:(password:string)=>Promise<boolean>
    SignAccesToken:()=>string
    SignRefreshToken:()=>string
    _id?:string
}
declare global{
    namespace Express{
        interface Request{
            user?:userinfra
        }
    }
}

