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


module.exports = {protectRoutes}