
function globalErrorHandler(err,req,res,next){
    res.status(err.statusCode || 500).json({
        success:false,
        message:err.message,
        data:{},
    })
}

export default globalErrorHandler;