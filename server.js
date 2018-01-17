var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var app = express();



mongoose.connect("mongodb://localhost/politiscraper");
var db = mongoose.connection;



app.use(express.static("public"));
app.use(logger("dev"));
// app.use(bodyParser.urlencoded({
//   extended: false
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// app.use(express.static("views/assets"));
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

require("./controller/routes.js")(app, request, bodyParser, cheerio, db);


db.on("error", function(error) {
  console.log("Database Error:", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
