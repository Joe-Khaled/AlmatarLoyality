const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper=require('../middlewares/asyncWrapper');
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient()
const mapping = require('../utils/transactionMapping');
const validation=require('../utils/validation');
const expireTransaction = require('../jobs/expireTransaction');

const emailSchema=validation.emailSchema
//Create New Transfer Logic

const createNewTransfer = asyncWrapper(async (req, res, next) => {
    const { toEmail, amount } = req.body;
    const currentUserId = req.currentUser.sub;
    const {value,error}=emailSchema.validate({email:toEmail});
    if(error)
    {
        const failure=appError.create(error.message, 400, httpStatusText.FAILED);
        return res.status(400).json(failure);
    }

    if (amount <= 0) {
        const failure=appError.create("Minimum amount is 1", 400, httpStatusText.FAILED);
        return res.status(400).json(failure);
    }

    const sender = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (!sender) 
    {
        const failure=appError.create("Sender not found", 404, httpStatusText.FAILED)
        return res.status(404).json(failure);
    }

    if(amount>sender.points)
    {
        const failure=appError.create("No sufficient points", 400, httpStatusText.FAILED)
        return res.status(400).json(failure);
    }

    const receiver = await prisma.user.findUnique({ where: { email: toEmail } });
    if (!receiver) {
        const failure=appError.create("Receiver not found", 404, httpStatusText.FAILED);
        return res.status(404).json(failure);
    }

    if (receiver.id === currentUserId) {
        const failure=appError.create("Invalid transaction", 400, httpStatusText.FAILED);
        return res.status(400).json(failure)
    }

    const now = new Date();
    const plus10Minutes = new Date(now.getTime() + 10 * 60 * 1000);

    const transaction = await prisma.transaction.create({
        data: {
            amount,
            fromUserId: currentUserId,
            toUserId: receiver.id,
            status: "PENDING",
            expiresAt: plus10Minutes,
        },
    });

    await expireTransaction(transaction.id);

    res.status(201).json({
        message: "Transaction created, confirm within 10 minutes",
        transaction,
    });
});

//Confirm New Transfer Logic 
const confirmTransfer = asyncWrapper(async (req, res, next) => {
        const id = req.params.id;
        const currentUserId = req.currentUser.sub;

        const result = await prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.findUnique({
                where: { id },
                include: { fromUser: true, toUser: true },
            });

            if (!transaction) return appError.create("Transaction not found", 404, httpStatusText.FAILED);
            if (transaction.status !== "PENDING") throw appError.create("Transaction already processed", 400, httpStatusText.FAILED);
            if (transaction.expiresAt < new Date()) throw appError.create("Transaction expired", 400, httpStatusText.FAILED);

            if (transaction.fromUserId !== currentUserId) {
                throw appError.create("Not authorized to confirm this transfer", 403, httpStatusText.FAILED);
            }

            if (transaction.fromUser.points < transaction.amount) {
                throw appError.create("Not enough points to transfer", 400, httpStatusText.FAILED);
            }

            await prisma.user.update({
                where: { id: transaction.fromUserId },
                data: { points: { decrement: transaction.amount } },
            });

            await prisma.user.update({
                where: { id: transaction.toUserId },
                data: { points: { increment: transaction.amount } },
            });

            const updatedprisma = await prisma.transaction.update({
                where: { id: transaction.id },
                data: { 
                    status: "CONFIRMED",
                    confirmedAt:new Date()
                 },
            });

            return updatedprisma;
        });

        res.status(200).json({ message: "Transfer confirmed successfully", transaction: result });
});


//Get List Of All Transactions (ADMIN)
const listAllTransactions=asyncWrapper(
    async(req,res,next)=>{
        const page=Number(req.query.page),limit=Number(req.query.limit),orderBy=req.query.createdAt;
        const skip=(page-1)*limit
        const allTransactions=await prisma.transaction.findMany({
            orderBy:{createdAt :orderBy || "asc"},
            skip:skip || 0,
            take:limit || 10,
             include:{
                fromUser:{
                    select:{name:true}
                },
                toUser:{
                    select:{name:true}
                }
            },
        })
        if(allTransactions.length)
        {
            const mappedTransactions=mapping(allTransactions);
            return res.status(200).json({allTransactions:mappedTransactions});
        }
        res.status(200).json({message:"No transactions found"});
    }
)

//Get List Of Current User Transactions 
const listSingleUserTransaction=asyncWrapper(
    async(req,res,next)=>{
        const id=req.currentUser.sub;
        const page=Number(req.query.page),limit=Number(req.query.limit),orderBy=req.query.createdAt;
        const skip=(page-1)*limit
        const userTransactions=await prisma.transaction.findMany({
            where:{
                 OR: [
                    { fromUserId: id },  
                    { toUserId: id } 
                ]
            },
            orderBy:{createdAt :orderBy || "asc"},
            skip:skip || 0,
            take:limit ||10,
            include:{
                fromUser:{
                    select:{name:true}
                },
                toUser:{
                    select:{name:true}
                }
            },
        })
        const mappedUserTransaction=mapping(userTransactions);
        res.status(200).json({userTransactions:mappedUserTransaction});
    }
)




module.exports={
    createNewTransfer,
    confirmTransfer,
    listAllTransactions,
    listSingleUserTransaction
}