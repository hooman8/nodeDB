const { Router } = require("express");
const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const subscriberController = require("./controllers/subscribersController");
const userController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");

app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose");
});

app.get("/courses", coursesController.getAllCourses, (req, res) => {
  if (res.locals.courses) {
    return res.json(res.locals.courses);
  }
  return res.json([]);
});
app.get("/courses/:id", coursesController.getSingleCourse, (req, res) => {
  return res.json(res.locals.course || []);
});
app.post(
  "/courses/create",
  coursesController.create,
  coursesController.redirectView
);

app.get("/subscribers", subscriberController.getAllSubscribers, (req, res) => {
  res.json(res.locals.subscribers || []);
});
app.post(
  "/subscribe",
  subscriberController.create,
  subscriberController.redirectView
);

app.get("/users", userController.getAllUsers, (req, res) => {
  if (res.locals.users) {
    return res.json(res.locals.users);
  }
  res.json([]);
});

app.post("/users/create", userController.create, userController.redirectView);

app.get("/users/:id", userController.getSingleUser, (req, res) => {
  return res.json(res.locals.user);
});

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
