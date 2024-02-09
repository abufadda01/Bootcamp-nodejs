const {Router} = require("express")
const {register , login , getMe} = require("../controllers/userControllers")
const { protectRoutes } = require("../middlewares/auth")

const router = Router()


router.post("/register" , register)

router.post("/login" , login)

router.get("/getMe" , protectRoutes , getMe)

module.exports = router

