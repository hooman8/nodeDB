const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const errorController = require("./controllers/errorController");
const User = require("./models/user");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose");
});
app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());
const methodOverride = require("method-override");
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
app.use(cookieParser("secret_passcode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIm = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

const subscriberController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");

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

app.post(
  "/users/create",
  body("email").isEmail().normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  usersController.create,
  usersController.redirectView
);
app.post("/users/login", usersController.authenticate, (req, res) => {
  let user = req.user;
  if (req.isAuthenticated()) {
    return res.status(200).json({ user });
  }
  return res.status(401).json({ error: "not authorized" });
});
app.get("/users/logout", usersController.logout);
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

app.use(errorController.logErrors);
app.use(errorController.respondNoErrorFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
