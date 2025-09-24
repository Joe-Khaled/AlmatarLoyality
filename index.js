require('dotenv').config();
const PORT=process.env.PORT;

const express=require('express');
const app=express();

const userRoutes=require('./src/routes/user');
const transactionRoutes=require('./src/routes/transaction');

app.use(express.json());

app.use('/api',userRoutes);
app.use('/api/transactions',transactionRoutes)

app.listen(PORT,()=>{
    console.log('app listening successfully');
})

