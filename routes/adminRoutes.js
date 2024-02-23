const {Router} = require("express")
const { protectRoutes, authorize } = require("../middlewares/auth")

const {getAllUsers , getSingleUser , createUser , updateUser , deleteUser} = require("../controllers/adminControllers")

const router = Router()

// all controllers for this route will use the protectRoutes , authorize middlewares in sequance way 
router.use(protectRoutes)
router.use(authorize("admin"))

router.get("/getAllUsers" , getAllUsers)

router.get("/getSingleUser/:userId" , getSingleUser)

router.post("/createUser" , createUser)

router.put("/updateUser/:userId" , updateUser)

router.delete("/deleteUser/:userId" , deleteUser)


module.exports = router



