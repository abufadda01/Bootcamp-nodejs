const User = require("../models/userModel")
const createError = require("../utils/createError")


const getAllUsers = async (req , res , next) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}




const getSingleUser = async (req , res , next) => {
    try {
        
        const user = await User.findById(req.params.userId)
        
        if(!user) return next(createError("user not exist" , 404))

        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}




const createUser = async (req , res , next) => {
    try {
        const newUser = new User(req.body)
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}




const updateUser = async (req , res , next) => {
    try {

        const updatedUser = await User.findByIdAndUpdate(req.params.userId , req.body , {
            new : true ,
            runValidators  : true
        })

        res.status(200).json(updatedUser)

    } catch (error) {
        next(error)
    }
}




const deleteUser = async (req , res , next) => {
    try {

        await User.findByIdAndDelete(req.params.userId)

        res.status(200).json({msg : "User deleted successfully"})

    } catch (error) {
        next(error)
    }
}



module.exports = {getAllUsers , getSingleUser , createUser , updateUser , deleteUser}