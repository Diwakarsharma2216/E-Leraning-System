import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs"

const emailRegexPattern:RegExp=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{
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
}

const userSchema:Schema<IUser>=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value:any) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email"
        },
        unique: true
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:[6,"Password must be at least 6 character"],
        select:false
    },
    avatar:{
        public_id:String,
        url:String
    },
    role:{
        type:String,
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    courses:[
        {
            courseId:String
        }
    ]
},{timestamps:true})

userSchema.pre<IUser>("save",async function (next) {
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,5)
    next()

})

userSchema.methods.comparePassword=async function (enteredPassword:string):Promise<boolean>{
return await bcrypt.compare(enteredPassword,this.password)
    
}

export const UserModel:Model<IUser>=mongoose.model("User",userSchema)

