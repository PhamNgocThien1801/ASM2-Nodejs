const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const checkIsAdmin = require("../config/checkIsAdmin");

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
  account(req, res, next) {
    var userID = req.user._id;
    var showListUser = false;
    var checkAdmin = false;

    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    User.findById(userID).then((user) => {
      res.render("user", {
        title: "Account Page",
        user: user,
        showListUser: showListUser,
        checkAdmin: checkAdmin,
      });
    });
    if (checkIsAdmin(req.user.isAdmin)) {
      showListUser = true;
    }
  }
  editAccount(req, res, next) {
    var userID = req.params.accountID;
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    const { name, yob, username, password } = req.body;
    let age = currentYear - yob;
    console.log(age);
    User.findById(userID)
      .then((user) => {
        res.render("editUser", {
          title: "Edit Account",
          user: user,
          checkAdmin: checkAdmin,
        });
      })
      .catch((err) => {
        if (age < 18) {
          // Duplicate key error, return error message to user
          req.flash("error", "You must be at least 18 years old");
          res.redirect("/auth/account");
        }
        if (age > 100) {
          // Duplicate key error, return error message to user
          req.flash("error", "Year of birth is invalid");
          res.redirect("/auth/account");
        } else {
          // Other error, log and return generic error message to user
          console.log(err);
          res.status(500).send("Error creating player");
        }
        console.log(err);
      });
  }
  // update(req, res, next) {
  //   var checkAdmin = false;
  //   if (req.user && checkIsAdmin(req.user.isAdmin)) {
  //     checkAdmin = true;
  //   }
  //   const playerID = req.params.id;
  //   Players.updateOne({ _id: playerID }, req.body)
  //     .then(() => {
  //       res.redirect("/");
  //     })
  //     .catch((err) => {
  //       if (err.code === 11000) {
  //         // Duplicate key error, return error message to user
  //         req.flash("error", "Name already exists");
  //         res.redirect("/");
  //       } else {
  //         // Other error, log and return generic error message to user
  //         console.log(err);
  //         res.status(500).send("Error creating player");
  //       }
  //       console.log(err);
  //     });
  // }
  updateAccount(req, res, next) {
    var userID = req.params.accountID;
    var checkAdmin = false;
    const { name, yob, username, password } = req.body;
    let age = currentYear - yob;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    if (age < 18 || age > 100) {
      req.flash(
        "error",
        "Invalid year of birth entered. Please enter a valid year between 1900 and the current year"
      );
      res.redirect("/auth/account");
    } else {
      User.updateOne({ _id: userID }, req.body)
        .then(() => {
          res.redirect("/auth/account");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Error updating account");
        });
    }
  }
  listUser(req, res, next) {
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    if (checkIsAdmin(req.user.isAdmin)) {
      User.find({}).then((user) => {
        res.render("listUser", {
          title: "List User",
          user: user,
          checkAdmin: checkAdmin,
        });
      });
    } else {
      req.flash("error_msg", "Only Admin can do this action!");
      res.redirect("/auth/account");
    }
  }
}

module.exports = new userController();
