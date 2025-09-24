const express=require('express');
const router=express.Router();
const userControllers=require('../controllers/user');
const verifyToken = require('../middlewares/verifyToken');

router.post('/auth/user',userControllers.register)

router.post('/auth/user/login',userControllers.signIn)

router.get('/user/points',verifyToken,userControllers.getPoints)

module.exports=router