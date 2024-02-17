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
        type : mongoose.Schema.ObjectId ,
        ref : "bootcamps" ,
        required : true
    },
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : "users" ,
        required : true
    }
})


/////////////////////////////////////////////////////////////

// statics methods , default methods

// statics methods : called dierctly from the model it self in any controller 
// Model.static_method_name

// default methods : we need to create a query obj element first thenwe could access the method
// const ele = await Model.findOne({})
// ele.method_name

/////////////////////////////////////////////////////////////////



// create a static method called getAverageCost to get avg cost of course tuition
courseSchema.statics.getAverageCost = async function(bootcampId){

    // this will be a ref to the current course doc obj
    // aggregate takes an array of pipline (stages)
    const aggregatedCourseObj = await this.aggregate([
        // returned the courses that its bootcamp key $match the bootcampId parameter
        {$match : {bootcamp : bootcampId}},
        // then group them in one object with two keys : { _id : the id of the bootcamp , averageCost : the tuition avg of these courses} 
        // _id , averageCost keys that we create them 
        // $key_in_the_schema , operator : {$avg : "$tuition"}
        {$group : 
            {
                _id : "$bootcamp" ,
                averageCost : {$avg : "$tuition"}
            }
        }

        // aggregatedCourseObj : [{ _id: new ObjectId('5d725a1b7b292f5f8ceff788'), averageCost: 13500 }]
    
    ])

    
    try {
        await this.model("bootcamps").findByIdAndUpdate(bootcampId , {
            averageCost : Math.ceil(aggregatedCourseObj[0].averageCost / 10) * 10
        })
    } catch (error) {
        console.log(error)
    }

}


// post save mongoose hook
courseSchema.post("save" , function(){
    // we use constructor. because its a static method so we need to call it directly from the model defintion
    // call getAverageCost() static method every time we create a new course
    this.constructor.getAverageCost(this.bootcamp)
})


// pre deleteOne mongoose hook
courseSchema.pre("deleteOne" , function(){
    // we use constructor. because its a static method so we need to call it directly from the model defintion
    // call getAverageCost() static method every time we delete a course
    this.constructor.getAverageCost(this.bootcamp)
})


const Course = mongoose.model("courses" , courseSchema)


module.exports = Course