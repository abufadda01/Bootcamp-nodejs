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


// statics methods , default methods

// statics methods : called dierctly from the model it self in any controller 
// Model.static_method_name

// default methods : we need to create a query obj element first thenwe could access the method
// const ele = await Model.findOne({})
// ele.method_name


// create a static method called getAverageCost to get avg cost of course tuition
courseSchema.statics.getAverageCost = async function(bootcampId){

    // this will be a ref to the current course doc obj
    const courseObj = await this.aggregate([])
}


// post save mongoose hook
courseSchema.post("save" , function(){
    
})


// pre deleteOne mongoose hook
courseSchema.pre("deleteOne" , function(){

})


const Course = mongoose.model("courses" , courseSchema)


module.exports = Course