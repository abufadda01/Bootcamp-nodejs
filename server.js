const express = require("express")

require("dotenv").config({path : "./config/.env"})


const app = express()

// create 5 bootcamps routes
// get , get with specific id
// post
// put with specific id
// delete with specific id


const PORT = process.env.PORT 

app.listen(PORT , () => {
    console.log(`Bootcamp server in ${process.env.NODE_ENV} mode & running on port ${PORT}`)
})
