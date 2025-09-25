const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
        required: false
    },
    age:{
        type:Number,
        min:6,
        max:75
    },
    email: {
    type: String,
    required: true,     
    unique: true,       
    trim: true,        
    lowercase: true  
   },
   problemSolved: [{
    type: Schema.Types.ObjectId,
    ref: 'problems'
  }],
   role:{
      type:String,
      enum:['user','admin'],
      default:'user'
   },
   password:{
      type:String,
      min:4,
      required:true
   }

},{timestamps:true});

const User = mongoose.model("users",userSchema);

module.exports = User;