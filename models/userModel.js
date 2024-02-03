const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , "please add a name"]
    },
    email : {
        type : String ,
        required : [true , "please add an email"] ,
        unique : true ,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "please add a valid email structure"]
    }
})