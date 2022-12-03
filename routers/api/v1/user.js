const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../../../controllers/api/v1/user");

router.post("/sign-up", controller.createUser);

router.post("/verify", controller.verifyUser);

router.post("/sign-in", passport.authenticate("local", {failureRedirect: "auth-failure", failureMessage: true}), controller.login);

router.put("/reset-password", passport.authenticate("jwt", {failureRedirect: "auth-failure", failureMessage: true}), controller.resetPassword);

router.get("/auth-failure", controller.authFailure);

module.exports = router;