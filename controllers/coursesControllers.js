const createError = require("../utils/createError")
const Course = require("../models/courseModel")
const Bootcamp = require("../models/BootcampModel")


const getCourses = async (req , res , next) => {
    try {

        let query

        if(req.params.bootcampId){
            query = Course.find({bootcamp : req.params.bootcampId})
        }else{
            // .populate("key_name_in_the_schema") and this key will be ref id to another doc object , so we will get the whole referenced doc
            // query = Course.find().populate("bootcamp")

            // for specific populate keys , path : "key_name_in_the_schema" , select : "selected keys from this ref doc obj"
            query = Course.find().populate({
                path : "bootcamp" ,
                select : "name description"
            })
        }

        const courses = await query

        res.status(200).json(courses)
    
    } catch (error) {
        next(error)      
    }
}




const getCourse = async (req , res , next) => {
    try {
        const {courseId} = req.params

        const course = await Course.findById(courseId).populate({
            path : "bootcamp" ,
            select : "name description"
        })

        if(!course){
            return next(createError(`No course founded with this id ${courseId}` , 404))
        }

        res.status(200).json(course)

    } catch (error) {
        next(error)
    }
}




const addCourse = async (req , res , next) => {
    try {
        
        req.body.bootcamp = req.params.bootcampId

        const bootcamp = await Bootcamp.findById(req.params.bootcampId)

        if(!bootcamp){
            return next(createError(`Bootcamp with this id not found : ${id}` , 404))
        }

        const course = new Course(req.body)

        await course.save()

        res.status(201).json(course)

    } catch (error) {
        next(error)
    }
}



module.exports = {getCourses , getCourse , addCourse}