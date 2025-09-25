const express = require('express');
const AuthRouter = express.Router();
const {signup, signin, logout, adminRegister, deleteProfile} = require('../controllers/userAuth');
const AuthValidation  = require('../middleware/AuthValidation');
const adminMiddleware = require('../middleware/adminMiddleware');



AuthRouter.post('/register',signup);
AuthRouter.post('/login',signin);
AuthRouter.post('/logout',AuthValidation,logout);
AuthRouter.post('/admin/register',adminMiddleware,adminRegister);
AuthRouter.delete('/profile',AuthValidation,deleteProfile);

// check if user is authenticated
AuthRouter.get('/check',AuthValidation,(req,res)=>{
    const reply = {
        firstName: req.user.firstName,
        email: req.user.email,
        role: req.user.role,
        _id: req.user._id
    }
    res.status(200).json({message:"Valid User", user:reply});
});

// // fetch user profile
// AuthRouter.get('/get-profile',getprofile);

module.exports = AuthRouter;