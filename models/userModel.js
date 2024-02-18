const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


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

    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password , salt)
    this.password = hashedPassword
})


userSchema.methods.signJWT = function(){
    return jwt.sign({id : this._id} , process.env.JWT_SECRET , {expiresIn : process.env.JWT_EXPIRE})
}

userSchema.methods.verifyPassword = async function(passowrd , savedPassword){
    return await bcrypt.compare(passowrd , savedPassword)
}


userSchema.methods.getResetPasswordToken = function(){
    // create a token
    // .randomBytes(num_of_bytes) return a Buffer then we convert it to string
    const resetToken = crypto.randomBytes(20).toString("hex")

    // set the user resetPasswordToken key in the DB to the created token
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex") 

    // set the reset token expire date (10 min)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}


const User = mongoose.model("users" , userSchema)

 
module.exports = User