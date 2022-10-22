const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({})
    .exec()
    .then((subscribers) => {
      res.send(subscribers);
    })
    .catch((error) => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log("Promise completed");
    });
};
exports.saveSubscriber = (req, res, next) => {
  Subscriber.create({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  })
    .then((savedDocument) => {
      res.json(savedDocument);
    })
    .catch((error) => {
      console.log(error.message);
      return [];
    });
};
