const {Router} = require("express")
const {
    getCourses , 
    getCourse , 
    addCourse , 
    updateCourse , 
    deleteCourse
} = require("../controllers/coursesControllers")

const {protectRoutes , authorize} = require("../middlewares/auth")

// to allow another routes to redierct to this route
const router = Router({mergeParams : true})


router.get("/" , getCourses)
    
router.get("/:courseId" , getCourse)

router.post("/" , protectRoutes , authorize("publisher" , "admin") , addCourse)

router.put("/updateCourse/:courseId" , protectRoutes , authorize("publisher" , "admin") , updateCourse)

router.delete("/deleteCourse/:courseId" , protectRoutes , authorize("publisher" , "admin") , deleteCourse)


module.exports = router