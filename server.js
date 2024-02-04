const express = require("express")
const morgan = require("morgan")
const colors = require("colors")
const fileUpload = require("express-fileupload")
const path = require("path")

require("dotenv").config({path : "./config/.env"})

const connectDB = require("./db/connectDB")


const app = express()


// middlewares
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

app.use(fileUpload())
app.use(express.json()) 

// set static folder middleware to make the public folder accessable from any place
app.use(express.static(path.join(__dirname , "public")))

///////////////////////////////////////



// routes
const bootcampsRoutes = require("./routes/bootcampsRoutes")
app.use("/api/v1/bootcamps" , bootcampsRoutes)

const coursesRoutes = require("./routes/coursesRoutes")
app.use("/api/v1/courses" , coursesRoutes)

const authRoutes = require("./routes/userRoutes")
app.use("/api/v1/auth" , authRoutes)



// custom middleware for error handling
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