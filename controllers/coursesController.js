const Course = require("../models/course");
const mongoose = require("mongoose");
const User = require("../models/user");

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
  join: (req, res, next) => {
    let courseId = req.params.id;
    let currentUser = req.user;
    try {
      if (mongoose.Types.ObjectId.isValid(courseId) && currentUser) {
        User.findByIdAndUpdate(currentUser, {
          $addToSet: {
            courses: courseId,
          },
        })
          .then(() => {
            res.locals.success = true;
            next();
          })
          .catch((error) => {
            next(error);
          });
      } else {
        throw new Error("User must be logged in");
      }
    } catch (error) {
      next(error);
    }
  },
  filterUserCourse: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCourses = res.locals.courses.map((course) => {
        let userJoined = currentUser.courses.some((userCourse) => {
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },
  respondWithJSON: (req, res) => {
    res.json({
      status: 200,
      data: res.locals,
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: 500,
        message: error.message,
      };
    } else {
      errorObject = {
        status: 500,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject);
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
};
