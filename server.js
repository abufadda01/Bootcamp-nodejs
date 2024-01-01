const express = require("express")

require("dotenv").config({path : "./config/.env"})


const app = express()

const PORT = process.env.PORT 

app.listen(PORT , () => {
    console.log(`Bootcamp server in ${process.env.NODE_ENV} mode & running on port ${PORT}`)
})
