// custom fun to return a custom res that contain the token and a cookie
const sendTokenResponse = (user , statusCode , res) => {

    const token = user.signJWT()

    const options = {
        // make it expires in 30 days , and accessable from user browser
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000) ,
        httpOnly : true
    }

    // add the secure key to the cookie options if it in the build mode (production)
    // to only send the cookie in https connection
    if(process.env.NODE_ENV === "production"){
        options.secure = true
    }
     
    res.status(statusCode).cookie("token" , token , options).json(token)

}


module.exports = sendTokenResponse