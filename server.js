var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var app = express();


mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/politiscraper");
var db = mongoose.connection;

require("./controller/routes.js")(app, request, bodyParser, cheerio, db);

app.use(express.static("public"));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.text());
// app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// app.use(express.static("views/assets"));
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");




db.on("error", function(error) {
  console.log("Database Error:", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
