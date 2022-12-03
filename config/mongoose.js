const mongoose = require("mongoose");
const env = require("./environment");

mongoose.connect("mongodb://localhost:27017/" + env.db_name);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error in connecting to DB"));
db.once("open", console.log.bind(console, "DB connected successfully"));

module.exports = db;