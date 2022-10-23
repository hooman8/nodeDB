const Course = require("../models/course");
const mongoose = require("mongoose");

module.exports = {
  getAllCourses: (req, res, next) => {
    Course.find({})
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching the courses: ${error.message}`);
        next(error);
      });
  },
  getSingleCourse: (req, res, next) => {
    courseId = req.params.id;
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      Course.findById(courseId)
        .then((course) => {
          res.locals.course = course;
          next();
        })
        .catch((error) => {
          console.log(
            `An error observed fetching a single course: ${error.message}`
          );
          next(error);
        });
    } else {
      res.status(400).send("Invalid id");
    }
  },
  create: (req, res, next) => {
    let params = {
      title: req.body.title,
      description: req.body.description,
      items: [...req.body.items],
      zipCode: req.body.zipCode,
    };
    Course.create(params)
      .then((course) => {
        res.locals.course = course;
        res.locals.redirect = "/courses";
        next();
      })
      .catch((error) => {
        console.log(`Error in creating a new course: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
};
