const errorHandler = (err , req , res , next) => {

    console.log(err.stack.red)

    res.status(err.status || 500).json({
        message : err.message || "Something went wrong" ,
        success : false
    })
}


module.exports = errorHandler