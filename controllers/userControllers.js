const createError = require("../utils/createError")
const User = require("../models/userModel")

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

        const isPasswordMatched = user.verifyPassword(password)

        if(!isPasswordMatched){
            return next(createError(401 , "Invalid Credentials"))
        }

        const token = user.signJWT()

        res.status(200).json(token)

    } catch (error) {
        next(error)
    }
}


module.exports = {register , login}