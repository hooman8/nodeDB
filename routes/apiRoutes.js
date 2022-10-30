const router = require("express").Router();
const coursesController = require("../controllers/coursesController");
const usersController = require("../controllers/usersController");

router.use(usersController.verifyToken);

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
