const jwt=require('jsonwebtoken');

const generateJwt=async(payload)=>{
    const token=await jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'60m'});
    return token;
}

module.exports={
    generateJwt,
}