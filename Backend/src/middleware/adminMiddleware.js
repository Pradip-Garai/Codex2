const User = require('../models/users');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const adminMiddleware = async (req,res,next)=>{
    const { token } = req.cookies;
     
    if (!token) {
        return res.status(401).send("Token expired or missing.");
    }
     
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = payload;
     
    const result = await User.findById(_id);

    if(payload.role!='admin'){
        return res.status(404).send("Invalid Token");
    }

    if (!result) {
       return res.status(404).send("User not found.");
    }

    const isBlocked = await redisClient.exists(`token:${token}`);
    if(isBlocked){
        return res.status(404).json({
          message:"Invalid Token",
          success:false
        });
    }

    req.user = result;

    next();
}

module.exports = adminMiddleware;