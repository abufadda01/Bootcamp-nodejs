const fs = require("fs")
const mongoose = require("mongoose")
require("dotenv").config({path : "./config/.env"})
const colors = require("colors")

const Bootcamp = require("./models/BootcampModel")



mongoose.connect(process.env.MONGO_DB_COMPASS_URL)
    .then(() => console.log(`Bootcamps Database Connected Successfully`.white.bgBlue.underline))
    .catch((err) => console.log(`Failed to connect to the database , err : ${err} `))


const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json` , "utf-8"))

const importData = async (req , res , next) => {
    try {
        const importedBootcamps = await Bootcamp.create(bootcamps) 
        console.log("data imported");
        process.exit(1)
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async (req , res , next) => {
    try {
        await Bootcamp.deleteMany()
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