const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/user_controller");

router.get("/sign-in", passport.userUnauthenticated, controller.signIn);

router.get("/sign-out", passport.userAuthenticated, controller.signOut);

router.get("/sign-up", controller.signUp);

router.get("/verify/:id", controller.verify);

module.exports = router;