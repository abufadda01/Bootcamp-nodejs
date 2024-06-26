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
        // create a new body req key called bootcamp that match the bootcamp key in the schema and asign its value to the bootcampId params
        req.body.bootcamp = req.params.bootcampId
        req.body.user = req.user._id

        const bootcamp = await Bootcamp.findById(req.params.bootcampId)

        if(!bootcamp){ 
            return next(createError(`Bootcamp with this id not found : ${id}` , 404))
        }

        // only bootcamp owner and admins can update bootcamp
        if(bootcamp.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            return next(createError(`User ${req.user._id} is not authorized to add course to this bootcamp` , 401))
        }  
        
        const course = new Course(req.body)

        await course.save()

        res.status(201).json(course)

    } catch (error) {
        next(error)
    }
}




const updateCourse =  async (req , res , next) => {
    try {

        let course = await Course.findById(req.params.courseId)

        if(!course){
            return next(createError(`No course founded with this id ${req.params.courseId}` , 404))
        }

        // only bootcamp owner and admins can update bootcamp
        if(course.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            return next(createError(`User ${req.user._id} is not authorized to update course for this bootcamp` , 401))
        }

        course = await Course.findByIdAndUpdate(req.params.courseId , req.body , {
            new : true ,
            runValidators : true
        })

        res.status(200).json(course) 

    } catch (error) {
        next(error)
    }
}




const deleteCourse = async (req , res , next) => {
    try {
        
        const course = await Course.findById(req.params.courseId)

        if(!course){
            return next(createError(`No course founded with this id ${req.params.courseId}` , 404))
        }

         // only bootcamp owner and admins can update bootcamp
         if(course.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            return next(createError(`User ${req.user._id} is not authorized to delete course for this bootcamp` , 401))
        }

        await course.deleteOne()

        res.status(200).json({msg : "Course deleted successfully"})

    } catch (error) {
        next(error)
    }
}



module.exports = {
    getCourses , 
    getCourse , 
    addCourse , 
    updateCourse , 
    deleteCourse
}