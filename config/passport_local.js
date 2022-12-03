const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const encrypter = require("./encrypter");

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, function (email, password, done) {
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user || encrypter.decrypt({
            iv: user.iv,
            content: user.password
        }) !== password) {
            return done(null, false, {message: "Invalid username or password"});
        }
        if (user.verified){
            return done(null, user);
        }
        return done(null, false, "User is not verified");
    });
})
);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
        if (err) {
            console.log(err.toString());
            return done(err);
        }
        done(null, user);
    })
})

passport.userAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    if (req.xhr){
        return res.status(401).send("User is not signed-in");
    }
    res.redirect("/user/sign-in");
}

passport.userUnauthenticated = (req, res, next) => {
    if (req.isUnauthenticated()) {
        return next();
    }
    res.redirect("/");
}

module.exports = passport;