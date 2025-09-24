const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

module.exports=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.currentUser.role))
        {
            const failure=appError.create('this role is not authorized to make this operation',401,httpStatusText.FAILED)
            res.status(401).json(failure);
            return next(failure.message);
        }
        next();
    }
}