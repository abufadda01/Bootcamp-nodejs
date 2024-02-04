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

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}


module.exports = {register}