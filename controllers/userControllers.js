const createError = require("../utils/createError")
const User = require("../models/userModel")
const sendTokenResponse = require("../utils/sendTokenResponse")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const bcrypt = require("bcrypt")


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

        const isPasswordMatched = await bcrypt.compare(password , user.password)

        if(!isPasswordMatched){
            return next(createError("Invalid Credentials" , 400))
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

        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`

        const message = `you are receiving this email because you has requested to reset your passsword , make a PUT request to \n\n ${resetUrl}`
        
        try {

            await sendEmail({
                email : user.email ,
                subject : "reset password" ,
                message
            })

            res.status(200).json({msg : "reset passsword been sent to your email"}) 
        
        } catch (error) {
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



const resetPassword = async (req , res , next) => {
    try {
    
        // get the hashed token
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex") 
        
        // get the user by the resetPasswordToken , resetPasswordExpire in the DB , that we set them in forgot-password route
        // and check that the resetPasswordToken not expired yet (greater than current time)
        const user = await User.findOne({
            resetPasswordToken ,
            resetPasswordExpire : {$gt : Date.now()}
        }).select("+password")

        if(!user) return next(createError("Invalid token" , 400))

        // update user password , will be encrypted by our pre save mongoose hook
        user.password = req.body.password
        
        // reset the resetPassword keys in the DB
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        sendTokenResponse(user , 200 , res)

    } catch (error) {
        next(error)
    }
}



const updateUserDetails = async (req , res , next) => {

    try {
        
        // create an object contians the only fields that we want to update
        const fieldsToUpdate = {
            name : req.body.name ,
            email : req.body.email
        }

        let user = await User.findById(req.user._id)

        if(!user) return next(createError("User not exist" , 400))
        
        user = await User.findByIdAndUpdate(req.user._id , fieldsToUpdate , {
            new : true ,
            runValidators : true
        })

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}



const updateUserPassword = async (req , res , next) => {
    try {

        let user = await User.findById(req.user._id).select("+password")

        // check if the user entered the current password correctly , before change his password
        const isPasswordMatched = await bcrypt.compare(req.body.currentPassword , user.password)

        if(!isPasswordMatched) return next(createError("Incorrect password" , 400))

        // update user password , will be encrypted by our pre save mongoose hook
        user.password = req.body.newPassword
        await user.save()

        // send a new token after update the password
        sendTokenResponse(user , 200 , res)

    } catch (error) {
        next(error)        
    }
}



const logout = async (req , res , next) => {
    try {
        res.cookie("token" , "none" , {
            expires : new Date(Date.now() + 10 * 1000),
            httpOnly : true
        }).status(200).json({data : {}})
    } catch (error) {
        next(error)
    }
}



module.exports = {register , login , getMe , forgotPassword , resetPassword , updateUserDetails , updateUserPassword , logout}