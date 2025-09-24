const appError=require('../utils/appError')
const httpStatusText=require('../utils/httpStatusText')
module.exports=(fn)=>{
    return(req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            const error=appError.create(err.message,400,httpStatusText.ERROR);
            res.status(400).json(error);
            next(error.message);
     });
    }
}
