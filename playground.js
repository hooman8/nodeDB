const Subscriber = require("./models/subscriber");
const Course = require("./models/course");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/recipe_db", {
  UseNewUrlParser: true,
});
mongoose.Promise = global.Promise;

let sampleCourse;
let aSubscriber;

Course.create({
  title: "Apple Land",
  description: "locally farmed Apples only",
  zipCode: 12345,
  items: ["Apples", "heirloom"],
}).then((course) => (sampleCourse = course));

Subscriber.findOne({}).then((subscriber) => (aSubscriber = subscriber));

console.log(aSubscriber);
console.log(sampleCourse);

// aSubscriber.courses.push(sampleCourse._id);
// aSubscriber.save();

// Subscriber.populate(aSubscriber, "courses").then((subscriber) =>
//   console.log(subscriber)
// );
