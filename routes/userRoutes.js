const {Router} = require("express")
const {register} = require("../controllers/userControllers")

const router = Router()


router.post("/register" , register)


module.exports = router

