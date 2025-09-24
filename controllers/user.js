const Joi=require('joi');
const bcrypt=require('bcrypt')
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper=require('../middlewares/asyncWrapper');
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient()
const { generateJwt } = require('../utils/generateJwt');
const validation=require('../middlewares/validation');
//Validation Schemas

const registerSchema =validation.registerSchema
const signInSchema = validation.signInSchema

//Registration Logic
const register=asyncWrapper(
  async(req,res,next)=>{
    const {name,email,password,confirmPassword}=req.body;
    const {value,error}=registerSchema.validate({name,email,password,confirmPassword});
    // console.log(error);
    if(error)
    {
        const err=appError.create(error.details[0].message,400,httpStatusText.ERROR);
        return res.status(400).json(err);
    }
    const userRegistered=await prisma.user.findUnique({
        where:{
          email:email
        }
    })
    if(userRegistered)
    {
        const err=appError.create("Invalid Credentials",409,httpStatusText.ERROR);
        return res.status(409).json(err);
        
    }
    const hashedPassword=await bcrypt.hash(password,12);
    let normalizedEmail=value.email;
    normalizedEmail=normalizedEmail.toLowerCase()
    const newUser=await prisma.user.create({
      data:{
        name:value.name,
        email:normalizedEmail,
        password:hashedPassword,
        role:"USER"
      }
    })
    const success={message:"Successfully registered, Congratulations you gained 500 Points",statusCode:201,statusText:httpStatusText.SUCCESS,newUser};
    res.status(201).json(success);
})

//Sign in Logic

const signIn=asyncWrapper(
  async(req,res,next)=>{
    const {email,password}=req.body;
    const {value,error}=signInSchema.validate({email,password});
    if(error)
    {
      console.log(error);
        const err=appError.create("Invalid Credentials",404,httpStatusText.FAILED);
        res.status(404).json(err);
        return;
    }
    const userRegistered=await prisma.user.findUnique({
      where:{
        email:email
      },
    })
    if(!userRegistered)
    {
      const err=appError.create("Please Sign Up First",404,httpStatusText.FAILED);
      return res.status(404).json(err);
      
    }
    const passwordMatched=await bcrypt.compare(password,userRegistered.password);
    if(!passwordMatched)
    {
      const err=appError.create("Invalid Credentials",400,httpStatusText.FAILED);
      return res.status(400).json(err);
      
    }
    const token=await generateJwt({sub:userRegistered.id,role:userRegistered.role});
    res.status(200).json({message:"Logged in successfully",statusCode:200,statusText:httpStatusText.SUCCESS,token})
  }
)

//Get User Points Logic
const getPoints=asyncWrapper(
  async(req,res,next)=>{
    const id=req.currentUser.sub
    const points=await prisma.user.findUnique({
      where:{
        id:id
      },
      select:{
        points:true
      }
    })
    res.status(200).json({ status: "success", data: { points: `${points.points}` } });
  }
)

module.exports={
  register,
  signIn,
  getPoints
};