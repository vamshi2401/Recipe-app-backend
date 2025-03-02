const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
  const token=req.header('Authorization');

  if(!token || !token.startsWith("Bearer "))
    return res.status(401).json({message:"access denied"});

  const tokeng = token.split(" ")[1]; 
  console.log("Extracted Token:", tokeng);


  try {
    const verified=jwt.verify(tokeng, process.env.JWT_SECRET);
    req.user=verified;
    next();
  } catch (err){
    res.status(400).json({message:'Invalid token'}); 
  }
};