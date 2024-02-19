const createError = require("../utils/createError")
const User = require("../models/userModel")
const sendTokenResponse = require("../utils/sendTokenResponse")
const sendEmail = require("../utils/sendEmail")


const register = async (req , res , next) => {

    try {

        const {name , email , password , role} = req.body

        const user = new User({
            name ,
            email ,
            password ,
            role
        })

        await user.save()

        const token = user.signJWT()

        res.status(201).json(token)

    } catch (error) {
        next(error)
    }
}



const login = async (req , res , next) => {

    try {
    
        const {email , password} = req.body
        
        if(!email || !password){
            return next(createError(400 , "Please provide email and password "))
        }

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return next(createError(401 , "Invalid Credentials"))
        }

        const isPasswordMatched = user.verifyPassword(password , user.password)

        if(!isPasswordMatched){
            return next(createError(401 , "Invalid Credentials"))
        }

        sendTokenResponse(user , 200 , res)


    } catch (error) {
        next(error)
    }
}




const getMe = async (req , res , next) => {
    
    try {
        const user = await User.findById(req.user._id)

        if(!user){
            return next(createError("User not exist" , 404))
        }

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}



const forgotPassword = async (req , res , next) => {
    try {
        
        const user = await User.findOne({email : req.body.email})
        
        if(!user){
            return next(createError("User not exist" , 404))
        }

        const resetToken = user.getResetPasswordToken()
        
        await user.save({validateBeforeSave : false})

        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/resetPassword/${resetToken}`

        const message = `you are receiving this email because you has requested to reset your passsword , make a PUT request to \n\n ${resetUrl}`
        
        try {

            await sendEmail({
                email : user.email ,
                subject : "reset password" ,
                message
            })

            res.status(200).json({msg : "reset passsword been sent to your email"}) 
        
        } catch (error) {
            console.log(error);
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save({validateBeforeSave : false})
            return next(createError("reset password email could not been send" , 500))
        }
        
        res.status(200).json(user) 

    } catch (error) {
        next(error)
    }
}



module.exports = {register , login , getMe , forgotPassword}