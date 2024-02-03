const {Router} = require("express")
const {getBootcamps , getBootcamp , createBootcamp , updateBootcamp , deleteBootcamp , getBootcampsByRadius , uploadBootcampPhoto} = require("../controllers/bootcampsControllers")

const router = Router()


// if we have "/:bootcampId/courses" url serve it (redirect it) with coursesRoutes
// and GET , POST the courses using courses route , since they are connected togther by ref id
// will handle the GET , POST cases with coursesRoutes 
// and the coursesRoutes have an access to the url params , quires from this url ("/bootcamps/:bootcampId/courses") 
const coursesRoutes = require("./coursesRoutes")
router.use("/:bootcampId/courses" , coursesRoutes)
///////////////////////////////


router.get("/" , getBootcamps) // router.route("/").get(getBootcamps)

router.get("/:id" , getBootcamp) // router.route("/:id").get(getBootcamp)

router.post("/" , createBootcamp) // router.route("/").post(createBootcamp)

router.put("/updateBootcamp/:id" , updateBootcamp) // router.route("/updateBootcamp/:id").put(updateBootcamp)

router.delete("/deleteBootcamp/:id" , deleteBootcamp) // router.route("/deleteBootcamp/:id").delete(deleteBootcamp)

router.get("/radius/:zipcode/:distance" , getBootcampsByRadius)

router.put("/:id/uploadBootcampPhoto" , uploadBootcampPhoto)

module.exports = router