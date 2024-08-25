const jwt=require('jsonwebtoken')
const userModel=require('./models/User')


const Auth=async (req,res,next)=>{
    const token=req.header("Authorization")
    if(!token){
        res.status(401).json({message:"token not found"})
    }
    const jwtToken=token.replace('Bearer' ,"").trim();
    try {
        const decoded=jwt.verify(jwtToken,"Neeleshkumarmeena")
        const data=await userModel.findOne({username:decoded.username}).select({password:0})
        console.log(data)
        req.user=data;
        req.token=token;
        req.userId=data._id;
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({message:"invalid token"})
    }
    next();
}
module.exports=Auth