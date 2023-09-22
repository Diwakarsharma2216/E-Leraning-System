class ErrorHandling extends Error{
    statusCode:Number;
    constructor(message:any,statusCode:Number){
        super(message)
        this.statusCode=statusCode
        Error.captureStackTrace(this.constructor)
    }
}

export  default ErrorHandling