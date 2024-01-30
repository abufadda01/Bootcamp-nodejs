const fs = require("fs")
const mongoose = require("mongoose")
require("dotenv").config({path : "./config/.env"})
const colors = require("colors")

const Bootcamp = require("./models/BootcampModel")
const Course = require("./models/courseModel")



mongoose.connect(process.env.MONGO_DB_COMPASS_URL)
    .then(() => console.log(`Bootcamps Database Connected Successfully`.white.bgBlue.underline))
    .catch((err) => console.log(`Failed to connect to the database , err : ${err} `))


const data = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json` , "utf-8"))


const importData = async (req , res , next) => {
    try {
        await Course.create(data) 
        console.log("data imported");
        process.exit(1)
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async (req , res , next) => {
    try {
        await Course.deleteMany()
        console.log("data deleted");
        process.exit()
    } catch (error) {
        console.log(error);
    }
}


if(process.argv[2] === "-i"){
    importData()
}else if(process.argv[2] === "-d"){
    deleteData()
}
 

// will give the path of the main node downloaded folder , C:\Program Files\nodejs\node.exe
// console.log(process.argv[0]);

// will give the full path of the current javascript file , C:\Users\Laith abu fadda\Desktop\Bootcamp-nodejs\server.js
// console.log(process.argv[1]);

// will give any another command line arguments
// console.log(process.argv[2]);