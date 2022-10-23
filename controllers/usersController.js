const User = require("../models/user");

module.exports = {
  getAllUsers: (req, res, next) => {
    User.find({})
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error ferching users: ${error.message}`);
        next(error);
      });
  },
  getSingleUser: (req, res, next) => {
    let userId = req.params.id;
    console.log(userId);
    User.findById(userId)
      .then((user) => {
        console.log(user);
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error in fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  create: (req, res, next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
      courses: [...req.body.courses],
    };
    User.create(userParams)
      .then((user) => {
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
};
