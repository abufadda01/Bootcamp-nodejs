const {Router} = require("express")
const {
    getCourses , 
    getCourse , 
    addCourse , 
    updateCourse , 
    deleteCourse
} = require("../controllers/coursesControllers")


// to allow another routes to redierct to this route
const router = Router({mergeParams : true})


router.get("/" , getCourses)

router.get("/:courseId" , getCourse)

router.post("/" , addCourse)

router.put("/updateCourse/:courseId" , updateCourse)

router.delete("/deleteCourse/:courseId" , deleteCourse)


module.exports = router