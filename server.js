const express = require("express")
const morgan = require("morgan")
require("dotenv").config({path : "./config/.env"})


const app = express()

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

const bootcampsRoutes = require("./routes/bootcampsRoutes")
app.use("/api/v1/bootcamps" , bootcampsRoutes)



const PORT = process.env.PORT 

app.listen(PORT , () => {
    console.log(`Bootcamp server in ${process.env.NODE_ENV} mode & running on port ${PORT}`)
})
