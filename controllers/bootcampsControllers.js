const Bootcamp = require("../models/BootcampModel")
const createError = require("../utils/createError")
const geocoder = require("../utils/geoCoder")



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



const getBootcampsByRadius = async (req , res , next) => {
    try {
        const {zipcode , distance} = req.params

        // get the lat / lng from geocoder
        const loc = await geocoder.geocode(zipcode)
        const lat = loc[0].latitude
        const lng = loc[0].longitude

        // calc the radius by divide the distance with the radius of the earth
        const radius = distance / 3963
        
        const bootcamps = await Bootcamp.find({
            location : {$geoWithin : {$centerSphere : [ [lng , lat] , radius ] } }
        })

        res.status(200).json({
            count : bootcamps.length ,
            bootcamps 
        })

    } catch (error) {
        next(error)
    }
}




module.exports = {getBootcamps , getBootcamp , createBootcamp , updateBootcamp , deleteBootcamp , getBootcampsByRadius} 