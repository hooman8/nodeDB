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
        first: req.body.name.first,
        last: req.body.name.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
      courses: [...req.body.courses],
    };
    User.create(userParams)
      .then((user) => {
        req.flash("success", `${user}'s account created successfully!`);
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },
  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode);
    req.check("password", "password cannot be empty").isEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/create";
        next();
      } else {
        next();
      }
    });
  },
  authenticate: (req, res, next) => {
    User.findOne({
      email: req.body.email,
    })
      .then((user) => {
        if (user) {
          user.passwordComparison(req.body.password).then((passwordMath) => {
            if (passwordMath) {
              res.locals.redirect = `/users/${user._id}`;
              req.flash("success", `${user.fullname}'s logged in successfully`);
              res.locals.user = user;
              next();
            } else {
              req.flash("error", "Your account or password is incorrect");
              res.locals.redirect("/users/login");
              next();
            }
          });
        } else {
          req.flash("error", "Your account or password is incorrect");
          res.locals.redirect("/users/login");
          next();
        }
      })
      .catch((error) => {
        console.log(`Error loggin in user: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let userId = req.params.id;
    let userParams = {
      name: {
        first: req.body.name.first,
        last: req.body.name.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    };
    User.findByIdAndUpdate(userId, {
      $set: userParams,
    })
      .then((user) => {
        res.locals.user = user;
        res.locals.redirect = `/users/${userId}`;
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
};
