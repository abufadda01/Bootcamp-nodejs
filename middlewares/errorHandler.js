const errorHandler = (err , req , res , next) => {

    let errorObject = {
        msg : err.message || "Something went wrong" ,
        status : err.status || 500 ,
    }

    console.log(Object.values(err.errors).map(err => err.message));

    // mongoose error handling if the id format was incorrect or not exist 
    if(err.name === "CastError"){
        errorObject.msg = `Resource with this id not found : ${err.value}`
        errorObject.status = 404
    }

    // mongoose error handling for duplicated keys values
    if(err.code && err.code === 11000){
        errorObject.msg = `Duplicate ${Object.keys(err.keyValue)} field value enterd`,
        errorObject.status = 400
    }

    // mongoose validation error for required field
    if(err.name === "ValidationError"){
        // err.errors is an object , we take its keys values and convert it to an array and iterate on each one and access the message value
        // Object.values() return an array , err.errors structure : , {properties : {message : "" , ...}}
        errorObject.msg = Object.values(err.errors).map(error => error.message)
    }


    res.status(errorObject.status).json({
        msg : errorObject.msg ,
        success : false
    })

}


module.exports = errorHandler