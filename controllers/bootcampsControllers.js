const Bootcamp = require("../models/BootcampModel")
const createError = require("../utils/createError")
const geocoder = require("../utils/geoCoder")



const getBootcamps = async (req , res , next) => {
    try {

        let query 

        // make a copy of the req query
        let reqQuery = {...req.query}

        // array contain keys that we want to remove it from the req query object to not make it act as db key name , and make it act as a query operator $operator
        const removeFields = ["select" , "sort" , "page" , "limit"]
        removeFields.forEach(param => delete reqQuery[param])
        

        // we convert it to json string object to apply some operatrion
        let queryString = JSON.stringify(reqQuery)


        // replace() act as a regex , second parameter callback fun if one of the regex cases being matched , after passing the replace regex conditions  , the value after the regex checking
        // return value : $gt , $gte , $in 
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g , match => `$${match}`)


        // then we return it to json object structure to send as a filter object 
        query = Bootcamp.find(JSON.parse(queryString))  
        
        
        // filter the returned data by the selected keys
        if(req.query.select){
            // split to make as array index after each "," , then join at a string again
            const selectedFields = req.query.select.split(",").join(" ")
            query = query.select(selectedFields)
        }

        // filter the returned data by sorting key
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy)
        }else{
            // the sort case default condition
            query = query.sort("-createdAt")
        }



        const page = parseInt(req.query.page , 10) || 1
        const limit = parseInt(req.query.limit , 10) || 25
 
        const startIndex = (page - 1) * 10
        const endIndex = page * limit
        
        const count = await Bootcamp.countDocuments()

        query = query.skip(startIndex).limit(limit)


        const bootcamps = await query


        let pagination = {}

        // that mean i still have a coming data (we have another next page) , so we can increment the page with one
        // 20 < 30
        if(endIndex < count){
            pagination.next = {
                page : page + 1 ,
                limit
            }
        }

        // that means we have a previous data to go back to it , so we can decrement the page with one (we have a previous page)
        // 10 > 0
        if(startIndex > 0){
            pagination.prev = {
                page : page - 1 ,
                limit
            }
        }
        

        res.status(200).json({count , pagination , bootcamps})

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