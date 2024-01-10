const Bootcamp = require("../models/BootcampModel")



const getBootcamps = async (req , res , next) => {
try {
    res.status(200).json({msg : "get all bootcamps"})
} catch (error) {
    next(error)
}
}



const getBootcamp = async (req , res , next) => {
    try {
        res.status(200).json({msg : req.params.id})
    } catch (error) {
        next(error)
    }
}



const createBootcamp = async (req , res , next) => {
    try {

        const bootcamp = new Bootcamp(req.body)
        await bootcamp.save()

        res.status(200).json(bootcamp)
    
    } catch (error) {
        next(error)
    }
}



const updateBootcamp = async (req , res , next) => {
    try {
        
    } catch (error) {
        
    }
}



const deleteBootcamp = async (req , res , next) => {
    try {
        
    } catch (error) {
        
    }
}



module.exports = {getBootcamps , getBootcamp , createBootcamp , updateBootcamp , deleteBootcamp}