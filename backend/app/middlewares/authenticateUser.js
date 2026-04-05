
import jwt from "jsonwebtoken";
 export const authenticateUser=(req,res,next)=>{
    const token=req.headers['authorization']
    // console.log({"Body inside the authenticateUser":req.body})
    if(!token){
        return res.status(401).json({error:'token not provided'})
    }
    try{
        const tokenData=jwt.verify(token,process.env.JWT_KEY);
        // console.log("tokendata",tokenData);
        req.userId=tokenData.userId;
        // console.log(req.userId);
        req.role=tokenData.role;
        next();
    }catch(err){
        return res.status(401).json({error:err.message})
    }
}

