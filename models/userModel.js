const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


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



// mongoose pre save hook for password encryption
userSchema.pre("save" , async function(next){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password , salt)
    this.password = hashedPassword
})


userSchema.methods.signJWT = function(next){
    return jwt.sign({id : this._id} , process.env.JWT_SECRET , {expiresIn : process.env.JWT_EXPIRE})
}

userSchema.methods.verifyPassword = async function(passowrd){
    return await bcrypt.compare(passowrd , this.passowrd)
}


const User = mongoose.model("users" , userSchema)

module.exports = User