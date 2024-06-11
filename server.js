const express = require("express")
const morgan = require("morgan")
const colors = require("colors")
const fileUpload = require("express-fileupload")
const path = require("path")
const cookieParser = require("cookie-parser")

require("dotenv").config({path : "./config/.env"})

const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const {rateLimit} = require("express-rate-limit")


const connectDB = require("./db/connectDB")


const app = express()

// middlewares
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

app.use(fileUpload())
app.use(express.json()) 
app.use(cookieParser())

// set static folder middleware to make the public folder accessable from any place
app.use(express.static(path.join(__dirname , "public")))

///////////////////////////////////////
// security middleware
// prevent no-sql injection , add more secure headers , prevent cross site scripting xss 
// add max req limit 
app.use(mongoSanitize())
app.use(helmet())
app.use(cors())
app.use(xss())

const limiter = rateLimit({
    windowMs : 10 * 60 * 1000 ,
    max : 1
})

app.use(limiter)

// routes
const bootcampsRoutes = require("./routes/bootcampsRoutes")
app.use("/api/v1/bootcamps" , bootcampsRoutes)

const coursesRoutes = require("./routes/coursesRoutes")
app.use("/api/v1/courses" , coursesRoutes)

const authRoutes = require("./routes/userRoutes")
app.use("/api/v1/auth" , authRoutes)

const adminRoutes = require("./routes/adminRoutes")
app.use("/api/v1/admin" , adminRoutes)



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



// create and save a variable in the postman based on response value
// Tests tab in login request because we get the token as a res of this request
// pm.environment.set("TOKEN" , pm.response.json().token) , res.status(200).json({token : token}) to add global token var

// to use this token in requests that need Authorization header
// we use Authorization tab , type : Bearer token  , value : {{TOKEN}}
// then we dont need the Authorization header in postman 