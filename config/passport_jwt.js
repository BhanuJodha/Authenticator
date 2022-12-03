const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const jwtExtract = require("passport-jwt").ExtractJwt;
const env = require("./environment");
const User = require("../models/user");

passport.use(new JwtStrategy({
    secretOrKey: env.jwt_token,
    ignoreExpiration: true,
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
    User.findById(payload._id, (err, user) => {
        if (err){
            console.error(err);
            return done(err);
        }
        if (user){
            return done(null, user);
        }
        return done(null, false, "User not exists");
    });
}))


module.exports = passport;