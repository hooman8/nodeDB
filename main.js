const express = require("express");
const app = express();
const methodOverride = require("method-override");
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const subscriberController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
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

app.get("/users", usersController.getAllUsers, (req, res) => {
  if (res.locals.users) {
    return res.json(res.locals.users);
  }
  res.json([]);
});

app.post("/users/create", usersController.create, usersController.redirectView);

app.get("/users/:id", usersController.getSingleUser, (req, res) => {
  return res.json(res.locals.user);
});
// /users/${user._id}/update?_method=PUT
app.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
);

// /users/${user._id}/delete?_method=DELETE
app.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
