import nodemailer,{ Transporter } from "nodemailer";
import path from "path";
require("dotenv").config()
import ejs from "ejs"

interface EmailOptions{
    email:string;
    subject:string;
    template:string;
    data:{[key:string]:any}
}

const sendMail=async(options:EmailOptions):Promise<void>=>{
    const transporter:Transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:parseInt(process.env.SMTP_PORT || "578"),
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }
    })

    const {email,subject,template,data}=options

    // get the path template with ejs
    const templatePath=path.join(__dirname,"../mails",template)

    //render the email template with ejs
    const html:string=await ejs.renderFile(templatePath,data)

    const mailOption={
        from:process.env.SMTP_MAIL,
        to:email,
        subject,
        html
    }

    await transporter.sendMail(mailOption)
}

export default sendMail