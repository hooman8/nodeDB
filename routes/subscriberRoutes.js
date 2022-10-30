const router = require("express").Router();

const subscriberController = require("../controllers/subscribersController");

router.get("/", subscriberController.getAllSubscribers, (req, res) => {
  res.json(res.locals.subscribers || []);
});

router.post(
  "/subscribe",
  subscriberController.create,
  subscriberController.redirectView
);

module.exports = router;
