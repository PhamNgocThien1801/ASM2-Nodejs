var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const passport = require("passport");
const flash = require("connect-flash");

const mongoose = require("mongoose");
const Players = require("./models/player");

const url = "mongodb://127.0.0.1:27017/worldcup2022";
mongoose.set("strictQuery", true);
const connect = mongoose.connect(url);

// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/usersRouter");
const playerRouter = require("./routes/playerRouter");
const nationRouter = require("./routes/nationRouter");

var app = express();
require("./config/passport")(passport);
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(cookieParser("12345-67890"));
// app.use(
//   session({
//     name: "session-id",
//     secret: "12345-67890-09876-54321",
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
//   })
// );

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/", playerRouter);
app.use("/nations", nationRouter);
app.use("/auth", usersRouter);

// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.session.user) {
//     var err = new Error("You are not authenticated!");
//     err.status = 403;
//     return next(err);
//   } else {
//     if (req.session.user === "authenticated") {
//       next();
//     } else {
//       var err = new Error("You are not authenticated!");
//       err.status = 403;
//       return next(err);
//     }
//   }
// }

connect.then(
  (db) => {
    console.log("Connected correctly to server port 3000!");
  },
  (err) => console.log("Error: ", err)
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
