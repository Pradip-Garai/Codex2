const validator = require('validator');

const Validate = (data)=>{

    const mandetoryFields = ['firstName','email','password'];
    const isAllow = mandetoryFields.every((key)=> Object.keys(data).includes(key));

    if(!isAllow)
        throw new Error("Missing Fields !!!")

    if(!validator.isEmail(data.email))
        throw new Error("Invalid Email Format !!!");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Week Password !!!");

    if(!validator.isLength(data.firstName,{min:3,max:20}))
        throw new Error("Name length should be between 3 and 20 characters!");


}

module.exports = Validate;