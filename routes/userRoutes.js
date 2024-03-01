const {Router} = require("express")
const {register , login , getMe , forgotPassword , resetPassword , updateUserDetails , updateUserPassword , logout} = require("../controllers/userControllers")
const { protectRoutes } = require("../middlewares/auth")

const router = Router()


router.post("/register" , register)

router.post("/login" , login)

router.get("/logout" , logout)

router.get("/getMe" , protectRoutes , getMe)

router.post("/forgot-password" , forgotPassword)

router.put("/resetPassword/:resetToken" , resetPassword)

router.put("/update-user-details" , protectRoutes , updateUserDetails)

router.put("/update-user-password" , protectRoutes , updateUserPassword)


module.exports = router

