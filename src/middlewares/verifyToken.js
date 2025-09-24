const jwt=require('jsonwebtoken');
const appError=require('../utils/appError');
const httpStatusText=require('../utils/httpStatusText');
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient()

const verifyToken=async(req,res,next)=>{
    const authHeader=req.headers['Authorization']||req.headers['authorization'];
    if(!authHeader)
    {
        const error=appError.create('Token Is required',401,httpStatusText.ERROR);
        res.status(401).json(error);
        return next(error.message);
    }
    const token=authHeader.split(' ')[1];
    try{
        const currentUser=jwt.verify(token,process.env.JWT_SECRET_KEY);
        
        const user = await prisma.user.findUnique({ where: { id: currentUser.sub } });

        if (!user) {
        return res.status(401).json({ error: "User no longer exists" });
        }

        req.currentUser=currentUser;    
        next();
    }
    catch(err){
        // console.log(token)
        const error=appError.create('Invalid Token',401,httpStatusText.ERROR);
        res.status(401).json(error);
        return next(error.message);
    }
}
module.exports=verifyToken;
