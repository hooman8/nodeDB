const router = require("express").Router();
const coursesController = require("../controllers/coursesController");

router.get("/", coursesController.getAllCourses, (req, res) => {
  if (res.locals.courses) {
    return res.json(res.locals.courses);
  }
  return res.json([]);
});
router.get("/:id", coursesController.getSingleCourse, (req, res) => {
  return res.json(res.locals.course || []);
});
router.post(
  "/create",
  coursesController.create,
  coursesController.redirectView
);

module.exports = router;
