const mongoose = require("mongoose");
const { Schema } = mongoose;
const Subscriber = require("./subscriber");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const randToken = require("rand-token");
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
    apiToken: {
      type: String,
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
  let randomToken = randToken.generate(16);
  let user = this;
  if (!user.apiToken) {
    user.constructor.findOne({ apiToken: randomToken }).then((item) => {
      if (item) {
        console.log(`inside of if block`);
        user.apiToken = randToken.generate(16);
        next();
      } else {
        console.log(`inside of else block`);
        user.apiToken = randomToken;
        next();
      }
    });
  }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);
