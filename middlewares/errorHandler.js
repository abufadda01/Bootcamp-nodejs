const errorHandler = (err , req , res , next) => {

    let errorObject = {
        msg : err.message || "Something went wrong" ,
        status : err.status || 500 ,
    }

    // mongoose error handling if the id format was incorrect or not exist
    if(err.name === "CastError"){
        errorObject.msg = `Resource with this id not found : ${err.value}`
        errorObject.status = 404
    }

    res.status(errorObject.status).json({
        msg : errorObject.msg ,
        success : false
    })
}


module.exports = errorHandler