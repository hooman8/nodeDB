const mongoose = require("mongoose");
const User = require("./models/user");
const Subscriber = require("./models/subscriber");
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  UseNewUrlParser: true,
});

mongoose.Promise = global.Promise;

let createdUser;

User.create({
  name: {
    first: "Jorge",
    last: "Rivera",
  },
  email: "jorgerivera@gmail.com",
  password: "arlo02",
})
  .then((user) => {
    createdUser = user;
    return Subscriber.findOne({
      email: user.email,
    });
  })
  .then((subscriber) => {
    createdUser.subscribedAccount = subscriber;
    createdUser.save().then((user) => console.log(user));
  })
  .catch((error) => console.log(error.message));
