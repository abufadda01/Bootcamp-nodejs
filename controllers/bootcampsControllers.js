const Bootcamp = require("../models/BootcampModel")
const createError = require("../utils/createError")



const getBootcamps = async (req , res , next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json(bootcamps)
    } catch (error) {
        next(error)
    }
}



const getBootcamp = async (req , res , next) => {
    try {
        const {id} = req.params
        
        const bootcamp = await Bootcamp.findById(id)
        
        if(!bootcamp){
            return next(createError(`Resource with this id not found : ${id}` , 404))
        }

        res.status(200).json(bootcamp)

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
        const {id} = req.params
        
        const bootcamp = await Bootcamp.findByIdAndUpdate(id , req.body , {new : true , runValidators : true})

        if(!bootcamp){
            return next(createError("Bootcamp with this id not exist" , 404))
        }

        res.status(200).json(bootcamp)

    } catch (error) {
        next(error)
    }
}



const deleteBootcamp = async (req , res , next) => {
    try {
        const {id} = req.params
        
        const bootcamp = await Bootcamp.findByIdAndDelete(id)
        
        if(!bootcamp){
            return next(createError("Bootcamp with this id not exist" , 404))
        }

        res.status(200).json({msg : "Bootcamp deleted successfully"})

    } catch (error) {
        return next(createError("Bootcamp with this id not exist" , 404))
    }
}



module.exports = {getBootcamps , getBootcamp , createBootcamp , updateBootcamp , deleteBootcamp} 