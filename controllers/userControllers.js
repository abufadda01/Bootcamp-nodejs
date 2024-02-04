const createError = require("../utils/createError")


const register = async (req , res , next) => {
    try {
        res.status(200).json({msg : "welcome register route"})
    } catch (error) {
        next(error)
    }
}


module.exports = {register}