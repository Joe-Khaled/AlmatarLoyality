const express=require('express');
const router=require('express').Router();
const transactionControllers=require('../controllers/transaction');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');

router.post('/',verifyToken,transactionControllers.createNewTransfer)

router.post('/confirm/:id',verifyToken,transactionControllers.confirmTransfer)

router.get('/',verifyToken,allowedTo("ADMIN"),transactionControllers.listAllTransactions)

router.get('/user',verifyToken,transactionControllers.listSingleUserTransaction)

module.exports=router
