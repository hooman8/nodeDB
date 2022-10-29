const router = require("express").Router();
const userRoutes = require("./userRoutes");
const errorRoutes = require("./errorRoutes");

router.use("/users", userRoutes);
router.use("/", errorRoutes);
module.exports = router;
