const User = require("../models/user");
const passport = require("passport");
const mongoose = require("mongoose");
// const token = process.env.TOKEN || "recipeT0k3n";
const jsonWebToken = require("jsonwebtoken");

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
    if (mongoose.isValidObjectId(req.params.id)) {
      let userId = req.params.id;
      User.findById(userId)
        .then((user) => {
          res.locals.user = user;
          next();
        })
        .catch((error) => {
          console.log(`Error in fetching user by ID: ${error.message}`);
          next(error);
        });
    } else {
      return res.status(400).json({ error: "invalid id" });
    }
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
    User.register(userParams, req.body.password, (error, user) => {
      if (user) {
        res.locals.redirect = `/users/${user._id}`;
        next();
      } else {
        console.log(`Error in create function: ${error.message}`);
        next(error);
      }
    });
  },

  authenticate: passport.authenticate("local", {
    failureMessage: true,
  }),
  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  },
  apiAuthenticate: (req, res, next) => {
    passport.authenticate("local", (errors, user) => {
      if (user) {
        let signedToken = jsonWebToken.sign({ user: user._id }, "secret", {
          expiresIn: "1h",
        });
        res.json({
          success: true,
          token: signedToken,
        });
      } else {
        res.json({
          success: false,
          message: "could not authenticate user",
        });
      }
    })(req, res, next);
  },
  verifyJWT: (req, res, next) => {
    let token = req.headers.token;
    if (token) {
      jsonWebToken.verify(token, "secret", (errors, payload) => {
        if (payload) {
          console.log(payload);
          User.findById(payload.user).then((user) => {
            if (user) {
              next();
            } else {
              res.status(403).json({
                error: true,
                message: "no user account found",
              });
            }
          });
        } else {
          res.status(401).json({
            error: true,
            message: "cannot verify API token",
          });
          next();
        }
      });
    } else {
      res.status(401).json({
        error: true,
        message: "No Authentication Token Found",
      });
    }
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
  verifyToken: (req, res, next) => {
    let token = req.query.apiToken;
    if (token) {
      User.findOne({ apiToken: token })
        .then((user) => {
          if (user) next();
          else next(new Error("Invalid Api Token"));
        })
        .catch((error) => {
          next(new Error(error.message));
        });
    } else {
      next(new Error("Invalid API Token"));
    }
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
};
