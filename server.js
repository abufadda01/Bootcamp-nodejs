const express = require("express")
const morgan = require("morgan")
require("dotenv").config({path : "./config/.env"})
const connectDB = require("./db/connectDB")


const app = express()

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

const bootcampsRoutes = require("./routes/bootcampsRoutes")
app.use("/api/v1/bootcamps" , bootcampsRoutes)




const PORT = process.env.PORT 
let server

const start = async () => {
    try {
        await connectDB()
        server = app.listen(PORT , () => {console.log(`Bootcamp server in ${process.env.NODE_ENV} mode & running on port ${PORT}`)})
    } catch (error) {
        console.log(error)
    }
}


// handle unhandeled rejected promises
process.on("unhandledRejection" , (err , promise) => {
    // stop server excecute 
    // console.log(`Error : ${err.message}`)
    // server.close(() => process.exit(1))
})


start()