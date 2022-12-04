const User = require("../models/user")

exports.signIn = (req, res) => {
    res.render("sign_in", {
        title: "Sign In"
    })
}

exports.signUp = (req, res) => {
    res.render("sign_up", {
        title: "Sign Up"
    })
}

exports.signOut = (req, res) => {
    req.logOut((err) => {
        if(err) {
            return res.redirect("back");
        }
        res.redirect("/user/sign-in")
    })
}

exports.verify = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err || !user || user.verified){
            return res.redirect("back");
        }
        return res.render("verify_otp", {
            title: "Verify OTP",
            user: user
        })
    });
}