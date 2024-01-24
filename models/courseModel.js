const mongoose = require("mongoose")


const courseSchema = new mongoose.Schema({
    title : {
        type : String ,
        trim : true ,
        required : [true , "please add a course title"]
    },
    description : {
        type : String ,
        required : [true , "please add a course description"]
    },
    weeks : {
        type : String ,
        required : [true , "please add a number of weeks"]
    },
    tuition : {
        type : Number ,
        required : [true , "please add a tuition cost"]
    },
    minimumSkill : {
        type : String ,
        required : [true , "please add a minimum skill"],
        // enum means that this key value must be on of this array values
        enum : ["beginner" , "intermediate" , "advanced"]
    },
    scholarshipAvailable : {
        type : Boolean ,
        default : false
    },
    createdAt : {
        type : Date ,
        default : Date.now
    },
    bootcamp : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "bootcamps" ,
        required : true
    }
})


const Course = mongoose.model("courses" , courseSchema)


module.exports = Course