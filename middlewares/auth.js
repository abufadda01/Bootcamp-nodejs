const jwt = require("jsonwebtoken")
const createError = require("../utils/createError")
const User = require("../models/userModel")

const protectRoutes = async (req , res , next) => {
    
    let token
    
    try {

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }

        if(!token){
            return next(createError("Not authorized to access this route" , 401))
        }

        // verify the token , and get the payload object 
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET)

        // create a req key called user , contain the loggen in user
        req.user = await User.findById(decodedToken.id)

        next()

    } catch (error) {
        next(error)
    }
}


// to check the user role , and give him a permison based on it
// takes all roles as a parameter and return a middleware
// to check that the user role are includes in our roles parameter
const authorize = (...roles) => {
    return (req , res , next) => {

        if(!roles.includes(req.user.role)){
            return next(createError(`User role : "${req.user.role}" is not authorized to access this action` , 403))
        }
        
        next()
    }
}



module.exports = {protectRoutes , authorize}