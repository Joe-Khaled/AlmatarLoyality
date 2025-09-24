require('dotenv').config()
const { Queue } = require('bullmq');
const connection= { host: process.env.RREDIS_HOST, port: process.env.REDIS_PORT };

const transactionQueue = new Queue('transaction', {connection});
module.exports=async(transactionId)=>{
     return await transactionQueue.add('expireTransaction',
            {transactionId:transactionId},
            {
                delay:10 *60 *1000,
                jobId: transactionId 
            }
        )
    }