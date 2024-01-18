const {Router} = require("express")
const {getBootcamps , getBootcamp , createBootcamp , updateBootcamp , deleteBootcamp , getBootcampsByRadius} = require("../controllers/bootcampsControllers")

const router = Router()


router.get("/" , getBootcamps) // router.route("/").get(getBootcamps)

router.get("/:id" , getBootcamp) // router.route("/:id").get(getBootcamp)

router.post("/" , createBootcamp) // router.route("/").post(createBootcamp)

router.put("/:id" , updateBootcamp) // router.route("/:id").put(updateBootcamp)

router.delete("/:id" , deleteBootcamp) // router.route("/:id").delete(deleteBootcamp)

router.get("/radius/:zipcode/:distance" , getBootcampsByRadius)

module.exports = router