const AppError=require("../utils/appError");

const handleCastErrorDB=err=>{
  const message=`Invalid ${err.path}:${err.value}.`;
  return new AppError(message,400);
}
const handleDuplicateDB=err=>{
  const value=err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/);
  const message=`Duplicate value ${value}, please use another value`;
  return new AppError(message,400);
}

const handleValidationErrorDB=err=>{
  const error=Object.values(err.error).map(el=>el.message);
  const message=`Invalid input data. ${error.join(". ")}`;
  return new AppError(message,400);
}

const handleJWTExpiredError=err=> new AppError("Your token is expired,Please login again",401)

const sendErrorDev=(err,res)=>{
  res.status(err.statusCode).json({
    status:err.status,
    error:err,
    message:err.message,
    stack:err.stack
  })
}

const handleJWTError=err=>new AppError("Invalid Token, Please login again",401)

const sendErrorProd=(err,res)=>{
 if(err.isOperational){
  res.status(err.statusCode).json({
    status:err.status,
    message:err.message
  })
 }else{
   console.log("ERROR",err);
   res.status(500).json({
     status:"error",
     message:"something went wrong!"
   })
 }
}

module.exports=(err,req,res,next)=>{
    //console.log(err.stack);
    err.statusCode=err.statusCode||500;
    err.status=err.status||"error";
   
    if(process.env.NODE_ENV==="development"){
      sendErrorDev(err,res);

    }else if(process.env.NODE_ENV==="production"){
      let error={...err};
      if(error.name==="CastError") error=handleCastErrorDB(error);
      if(error.name==="ValidationError") error=handleValidationErrorDB(error);
      if(error.code===11000) error=handleDuplicateDB(error);
      if(error.name==="JsonWebTokenError") error=handleJWTError(error);
      if(error.name==="TokenExpiredError") error=handleJWTExpiredError(error);
      sendErrorProd(error,res)
    }
  }