const router = require("express").Router();
const usersController = require("../controllers/usersController");
const { body, validationResult } = require("express-validator");

router.get("/", usersController.getAllUsers, (req, res) => {
  if (res.locals.users) {
    return res.json(res.locals.users);
  }
  res.json([]);
});

router.post(
  "/create",
  body("email").isEmail().normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  usersController.create,
  usersController.redirectView
);
router.post("/login", usersController.authenticate, (req, res) => {
  let user = req.user;
  if (req.isAuthenticated()) {
    return res.status(200).json({ user });
  }
  return res.status(401).json({ error: "not authorized" });
});
router.get("/logout", usersController.logout);
router.get("/:id", usersController.getSingleUser, (req, res) => {
  return res.json(res.locals.user);
});
// /users/${user._id}/update?_method=PUT
router.put("/:id/update", usersController.update, usersController.redirectView);

// /users/${user._id}/delete?_method=DELETE
router.delete(
  "/:id/delete",
  usersController.delete,
  usersController.redirectView
);

module.exports = router;
