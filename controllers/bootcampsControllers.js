const { default: mongoose } = require("mongoose")
const Bootcamp = require("../models/BootcampModel")
const createError = require("../utils/createError")
const geocoder = require("../utils/geoCoder")
const Course = require("../models/courseModel")
const path = require("path")


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
        query = Bootcamp.find(JSON.parse(queryString)).populate("courses")  
        
        
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
        // add user key to the req body that will contain the logged in user id
        req.body.user = req.user._id

        // get any published bootcamp by this user (logged in user)
        const publishedBootcamp = await Bootcamp.findOne({user : req.user._id})

        // check if the user is not an admin and already published a bootcamp so he can't add another one
        // only admins can add more than one bootcamp
        if(publishedBootcamp && req.user.role !== "admin"){
            return next(createError(`User with this id ${req.user._id} already add a bootcamp` , 400))
        }

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
            return next(createError("Bootcamp with this id not existt" , 404))
        }

        res.status(200).json(bootcamp)

    } catch (error) {
        next(error)
    }
}




const deleteBootcamp = async (req , res , next) => {
    try {

        const {id} = req.params

        // delete all related courses to the bootcamp before delete the bootcamp it self
        await Course.deleteMany({bootcamp : new mongoose.Types.ObjectId(id)})

        const bootcamp = await Bootcamp.findOneAndDelete({_id : new mongoose.Types.ObjectId(id)})
    
        if(!bootcamp){
            return next(createError("Bootcamp with this id not existtttt" , 404))
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




const uploadBootcampPhoto = async (req , res , next) => {
    try {
        
        const bootcamp = await Bootcamp.findById(req.params.id)
        
        if(!bootcamp){
            return next(createError(`Resource with this id not found : ${req.params.id}` , 404))
        }

        if(!req.files){
            return next(createError("please upload a file" , 400))
        }

        // get the file obj from the req
        const file = req.files.file

        // validation to check that our uploaded file is an image only
        if(!file.mimetype.startsWith("image")){
            return next(createError("please upload an image file" , 400))            
        }

        // validation to check that our uploaded image file less than the allowed maxiumum size
        if(file.size > process.env.MAX_FILE_UPLOAD_SIZE){
            return next(createError(`please upload an image size less than ${process.env.MAX_FILE_UPLOAD_SIZE}` , 400))                        
        }

        // override the image file name and make it a custom unique name , photo_bootcampId.image_extension
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

        // .mv() fun that we use when save the uploaded file (mv means move)
        // .mv(where to upload path , async callback fun)   
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}` , async (err) => {
            
            if(err) return next(createError('Failed with image file upload' , 500))                        
            
            // if every thing ok , update the bootcamp "photo" key in the bootcamp doc obj 
            await Bootcamp.findByIdAndUpdate(req.params.id , {
                photo : file.name
            }, {new : true})

            res.status(200).json({data : file.name})

        })

    } catch (error) {
        console.log(error)
    }

}



module.exports = {getBootcamps , getBootcamp , createBootcamp , updateBootcamp , deleteBootcamp , getBootcampsByRadius , uploadBootcampPhoto} 