const express = require("express");
const app = express();
const port = 8000;
const scss = require("node-sass-middleware");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const env = require("./config/environment");
const MongoStore = require("connect-mongo");

// initialization section
const db = require("./config/mongoose");
const passport = require("./config/passport_jwt");
require("./config/passport_local")

// setting scss
app.use(scss({
    src: path.join(__dirname, "/assets/scss"),
    debug: true,
    dest: path.join(__dirname, "./assets/css"),
    prefix: "/css",
    outputStyle: "expanded"
}))

// serving static files
app.use(express.static("./assets"));

// setting layouts
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// setting view engine
app.set("view engine", "ejs");
app.set("views", "./views")

// extracting form and json data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret: env.jwt_token,
    name: "Authenticator",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 500000
    },
    store: MongoStore.create({
        mongoUrl: db.getClient().s.url
    })
}))

// setting passport authentication
app.use(passport.initialize());
app.use(passport.session());

// routing app requests
app.use(require("./routers/index.js"));


// starting server
app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log("Server is listening on port", port);
})