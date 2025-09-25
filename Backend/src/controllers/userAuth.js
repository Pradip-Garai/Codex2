require('dotenv').config();
const redisClient = require('../config/redis');
const User = require('../models/users');
const Validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Submission = require('../models/submission');


// signup 
const signup = async (req,res)=>{
    try{

        const {email,password} = req.body;

        // Validate
        Validate(req.body);
        
        // if user already exist 
        const isUserExists =  await User.exists({email});

        if(isUserExists){
            return res.status(409).json({
              success: false,
              message: "User already exists",
            });
        }

        // make sequre password
        req.body.password = await bcrypt.hash(password,10);
        req.body.role = 'user';
        
        // save data to database 
        const user = await User.create(req.body);

        // generate jwt token
        const token = jwt.sign({_id:user._id,role:user.role, email:email},process.env.JWT_SECRET);
        res.cookie('token',token);

        const reply = {
            firstName: user.firstName,
            email: user.email,
            _id: user._id,
            role: user.role
        }

        console.log("Signup Successfull");
        res.status(201).json({
            success:true,
            message:"Signup Successfull",
            user:reply
        });

        
            

    }catch(error){
        res.status(400).json({
          success: false,
          message: error.message || "Something went wrong",
        });
    }
};

// signin
const signin = async (req,res)=>{
    try{

        const { email,password} = req.body;
        if(!email || !password)
            throw new Error("Please Fill up Require Fields ");
        
        const user = await User.findOne({email});
        if(!user)
            throw new Error("Invalid Credantials");

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch)
            throw new Error("Invalid Credantials");


        const reply = {
            firstName: user.firstName,
            email: user.email,
            _id: user._id,
            role: user.role
        }

        // generate jwt token
        const token = jwt.sign({_id:user._id,role:user.role, email:email},process.env.JWT_SECRET,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});

        res.status(200).json({
            success:true,
            user:reply,
            message:"Login Successfull",
        });

    }catch(error){
        res.status(401).json({
          success: false,
          message: error.message || "Login Failed !!!",
        });
    }
}

// logout
const logout = async (req,res)=>{
    try{
       
        // check valid token 
        const { token } = req.cookies;

        // add token to blocklist
        const payload = jwt.decode(token);
        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);

        // send response 
        res.cookie('token',null,{expires: new Date(Date.now())});
        res.status(200).json({
            success:true,
            message:"Logout Successfull"
        });

    }catch(error){
        res.status(503).json({
          success: false,
          message: error.message || "Something Went Wrong !!!",
        });   
    }
}

const adminRegister = async (req,res)=>{
    try{

        const {email,password} = req.body;

        // Validate
        Validate(req.body);
        
        // if user already exist 
        const isUserExists =  await User.exists({email});

        if(isUserExists){
            return res.status(409).json({
              success: false,
              message: "User already exists",
            });
        }

        // make sequre password
        req.body.password = await bcrypt.hash(password,10);
        
        // save data to database 
        const user = await User.create(req.body);

        // generate jwt token
        const token = jwt.sign({_id:user._id,role:user.role, email:email},process.env.JWT_SECRET,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});

        res.status(201).json({
            success:true,
            message:"Admin Register Successfull",
            token:token,
            user:user.firstName
        });
            

    }catch(error){
        res.status(400).json({
          success: false,
          message: error.message || "Something went wrong",
        });
    }
}


const deleteProfile = async (req,res)=>{
     
    try{

        const userId = req.user._id;

        // delete user profile from user schema
        await User.findByIdAndDelete(userId);

        // delete from submiision
        await Submission.deleteMany({userId});

        res.status(200).json({
            message:"User Account Deleted Successfull",
            success:true
        })

    }catch(err){
       res.status(500).json({
         message:  err.message || "Internal Server Error",
         success : false
       })
    }
}

module.exports = {
    signup,
    signin,
    logout,
    adminRegister,
    deleteProfile
}