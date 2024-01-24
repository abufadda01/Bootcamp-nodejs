const createError = require("../utils/createError")
const Course = require("../models/courseModel")


const getCourses = async (req , res , next) => {
    try {

        let query

        if(req.params.bootcampId){
            query = Course.find({bootcamp : req.params.bootcampId})
        }else{
            query = Course.find()
        }

        const courses = await query

        res.status(200).json(courses)
    
    } catch (error) {
        next(error)      
    }
}




module.exports = {getCourses}