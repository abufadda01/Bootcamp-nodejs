const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , "please add a name"]
    },
    email : {
        type : String ,
        required : [true , "please add an email"] ,
        unique : true ,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "please add a valid email structure"]
    },
    role : {
        type : String ,
        enum : ["user" , "publisher"] ,
        default : "user"
    },
    password : {
        type : String ,
        required : [true , "please add a password"],
        minlength : 6 ,
        select : false
    },
    resetPasswordToken : String ,
    resetPasswordExpire : Date ,
} , {timestamps : true})


const User = mongoose.model("users" , userSchema)

module.exports = User