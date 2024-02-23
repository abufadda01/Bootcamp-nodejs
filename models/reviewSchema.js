const mongoose = require("mongoose")


const reviewSchema = new mongoose.Schema({
    title : {
        type : String ,
        trim : true ,
        required : [true , "please add a title for the review"]
    },
    text : {
        type : String ,
        required : [true , "please add some text"]
    },
    rating : {
        type : Number ,
        min : 1 ,
        max : 10 ,
        required : [true , "please add a rating betwwn 1 to 10"]        
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
      bootcamp : {
        type : mongoose.Schema.ObjectId ,
        ref : "bootcamps" ,
        required : true
    },
})


const Review = mongoose.model("reviews" , reviewSchema)

module.exports = Review