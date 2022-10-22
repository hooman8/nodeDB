const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const subscriberController = require("./controllers/subscribersController");

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

app.get(
  "/subscribers",
  subscriberController.getAllSubscribers,
  (req, res, next) => {
    console.log(req.data);
    res.send(req.data);
  }
);
app.post("/subscribe", subscriberController.saveSubscriber);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
