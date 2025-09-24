const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient()

const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const { Worker } = require('bullmq');
const connection= { host: process.env.RREDIS_HOST, port: process.env.REDIS_PORT };

const transactionWorker=new Worker('transaction',async(job)=>{
  if(job.name == 'expireTransaction'){
    const {transactionId}=job.data
    const transaction=await prisma.transaction.findUnique({
      where:{id:transactionId}
    })
    console.log(`Checking transaction ${transactionId}`);
    if(transaction.status=="PENDING")
    {
        try {
          await prisma.transaction.update({
            where:{id:transactionId},
            data:{status:"EXPIRED"}
          })
        } catch (err) {
          const error=appError.create(err.message,404,httpStatusText.ERROR);
          console.log(error);
        }
    }
  }
},{connection})