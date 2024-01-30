const express = require("express")
const morgan = require("morgan")
const colors = require("colors")
require("dotenv").config({path : "./config/.env"})
const connectDB = require("./db/connectDB")


const app = express()

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

app.use(express.json()) 


const bootcampsRoutes = require("./routes/bootcampsRoutes")
app.use("/api/v1/bootcamps" , bootcampsRoutes)


const coursesRoutes = require("./routes/coursesRoutes")
app.use("/api/v1/courses" , coursesRoutes)


const errorHandler = require("./middlewares/errorHandler")
app.use(errorHandler)


const PORT = process.env.PORT 
let server

const start = async () => {
    try {
        server = app.listen(PORT , () => {console.log(`Bootcamp server in ${process.env.NODE_ENV} mode & running on port ${PORT}`.yellow.bold)})
        await connectDB()
    } catch (error) {
        console.log(error)
    }
}


// handle unhandeled rejected promises
// process.on("unhandledRejection" , (err , promise) => {
    // stop server excecute 
    // console.log(`Error : ${err.message}`)
    // server.close(() => process.exit(1))
// })


start()