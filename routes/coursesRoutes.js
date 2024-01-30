const {Router} = require("express")
const {getCourses , getCourse , addCourse} = require("../controllers/coursesControllers")

const router = Router({mergeParams : true})


router.get("/" , getCourses)

router.get("/:courseId" , getCourse)

router.post("/" , addCourse)


module.exports = router