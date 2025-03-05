const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
//import { UserSchema} from '../models/usermodel.js';
const User=require('../models/usermodel');

const router=express.Router();

router.post('/auth/register',async (req,res)=>{
  const {username,email,password}=req.body
  try {
    const hashedPassword=await bcrypt.hash(password,10)
    const user=new User({username,email,password:hashedPassword})
    await user.save()
    res.json({'msg':'User registered'})
    console.log('user reg...')

  }
  catch(err){
    console.log(err)
  }
});

//login page api
router.post('/auth/login',async (req,res)=>{
  const {email,password}=req.body
  try {
    const user=await User.findOne({email});
    if (!user || !(await bcrypt.compare(password, user.password))){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    

    res.json({message:"login successful",username:user.username,token:token})
    console.log("user logged in ")
  }

  catch (err){
    console.log(err)
  }
});

module.exports=router;