var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var dbConnect = require ("./config/database.js");
var logger = require("morgan");
var cors = require("cors");
var routes = require("./routes/mainRoutes.js");
const mongoose = require("mongoose");
var dotenv = require("dotenv");

dotenv.config();
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//define routes
app.use(routes);

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//app.disable("etag"); // Disable ETag headers


// Error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status);

  res.render("error", {
    title: "Error Page", // Define the title for the page
    message: err.message || "An Error Occurred",
    error: process.env.NODE_ENV === "development" ? err : {}, // Show stack trace only in development
  });
});

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// activate mongoDB
dbConnect();


module.exports = app;
