const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({}, (error, subscribers) => {
    if (error) next(error);
    req.data = subscribers;
    next();
  });
};
exports.saveSubscriber = (req, res, next) => {
  Subscriber.create(
    {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode,
    },
    (error, savedDocument) => {
      if (error) res.send(error);
      res.json(savedDocument);
    }
  );
};
// Subscriber.findOne({name: 'Jorge Rivera'}).exec((error, data) => {
//     if(data) console.log(data);
// })
