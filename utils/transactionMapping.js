const mapping=(userTransactions)=>{
        const mappedUserTransaction=userTransactions.map((userTransaction)=>{
            userTransaction={
                id:userTransaction.id,
                amount:userTransaction.amount,
                createdAt:userTransaction.createdAt,
                expiresAt:userTransaction.expiresAt,
                confirmedAt:userTransaction.confirmedAt,
                status:userTransaction.status,
                sender:userTransaction.fromUser.name,
                reciever:userTransaction.toUser.name
            }
            return userTransaction;
        })
        return mappedUserTransaction;
}
module.exports=mapping;