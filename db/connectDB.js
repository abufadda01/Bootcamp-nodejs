const mongoose = require("mongoose")

const connectDB = () => {
    return mongoose.connect(process.env.MONGO_DB_COMPASS_URL)
            .then(() => console.log(`Bootcamps Database Connected Successfully`.white.bgBlue.underline))
            .catch((err) => console.log(`Failed to connect to the database , err : ${err} `))
}


module.exports = connectDB