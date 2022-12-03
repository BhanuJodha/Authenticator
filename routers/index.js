const express = require("express");
const passport = require("passport");
const router = express.Router();

// api requests
router.use("/api", require("./api/index"));

// sign-in requests
router.use("/user", require("./user"));

router.get("/", passport.userAuthenticated, require("../controllers/home_controller").home);

module.exports = router;