const mongoose = require("mongoose");
const { Schema } = mongoose;
const Subscriber = require("./subscriber");
const bcrypt = require("bcrypt");
const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code is too short"],
      max: 99999,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber",
    },
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function (next) {
  let user = this;
  Subscriber.findOne({
    email: user.email,
  })
    .then((subscriber) => {
      user.subscribedAccount = subscriber;
      next();
    })
    .catch((error) => {
      console.log(`Error in connecting subscriber: ${error.message}`);
      next(error);
    });
});

userSchema.pre("save", function (next) {
  let user = this;
  bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((error) => {
      console.log(`Error while hashing the password: ${error.message}`);
      next(error);
    });
});

userSchema.methods.passwordComparison = function (inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};
module.exports = mongoose.model("User", userSchema);
