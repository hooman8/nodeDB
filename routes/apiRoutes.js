const router = require("express").Router();
const coursesController = require("../controllers/coursesController");

router.get(
  "/courses",
  coursesController.getAllCourses,
  coursesController.respondWithJSON
);

router.get(
  "/courses/:id/join",
  coursesController.join,
  coursesController.respondWithJSON
);

router.get(
  "/courses/users",
  coursesController.getAllCourses,
  coursesController.filterUserCourse,
  coursesController.respondWithJSON
);

router.use(coursesController.errorJSON);

module.exports = router;
