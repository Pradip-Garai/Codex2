require('dotenv').config();
const mongoose = require('mongoose');

const DBConnect = async ()=>{
    try{
     
        await mongoose.connect(process.env.MONGO_URL);

    }catch(error){
        console.log(`Failed Connection `+error);
    }
}

module.exports = DBConnect;