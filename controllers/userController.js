const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

var today = new Date();
var currentYear = today.getFullYear();

class userController {
  index(req, res, next) {
    res.render("register", {
      title: "Register Page",
    });
  }
  register(req, res, next) {
    console.log(req.body);
    const { name, yob, username, password } = req.body;
    let age = currentYear - yob;
    let errors = [];
    if (!username || !password || !name || !yob) {
      errors.push({ msg: "Please input all fields!" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (age < 18 || age > 100) {
      errors.push({
        msg: "You must be over 18 years old and less than 100 years old!",
      });
    }
    if (errors.length > 0) {
      res.render("register", {
        title: "Register Page",
        errors: errors,
        name: name,
        yob: yob,
        username: username,
        password: password,
      });
    } else {
      User.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            title: "Register Page",
            errors: errors,
            name: name,
            yob: yob,
            username: username,
            password: password,
          });
        } else {
          const newUser = new User({
            title: "Register Page",
            name: name,
            yob: yob,
            username: username,
            password: password,
            isAdmin: false,
          });
          //Hash password
          bcrypt.hash(newUser.password, 10, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res.redirect("/auth");
              })
              .catch(next);
          });
        }
      });
    }
  }
  login(req, res, next) {
    res.render("login", {
      title: "Login Page",
    });
  }
  signIn(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth",
      failureFlash: true,
    })(req, res, next);
  }
  signOut(req, res, next) {
    req.logout(function (err) {
      if (err) return next(err);
      req.flash("success_msg", "You are logged out!");
      res.redirect("/auth");
    });
  }
}

module.exports = new userController();
