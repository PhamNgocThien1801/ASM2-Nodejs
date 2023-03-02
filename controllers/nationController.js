const Nations = require("../models/nation");
const checkIsAdmin = require("../config/checkIsAdmin");

class nationController {
  index(req, res, next) {
    // var showListUser = false;
    // if (checkIsAdmin(req.user.isAdmin)) {
    //   showListUser = true;
    // }
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    Nations.find({})
      .then((nations) => {
        res.render("nation", {
          title: "The list of nations",
          nations: nations,
          checkAdmin: checkAdmin,
          // showListUser: showListUser:
        });
      })
      .catch(next);
    console.log(req.body);
  }
  create(req, res, next) {
    const nation = new Nations(req.body);
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    nation
      .save()
      .then(() => res.redirect("/nations"))
      .catch((err) => {
        if (err.code === 11000) {
          // Duplicate key error, return error message to user
          req.flash("error", "Nation name already exists");
          res.redirect("/nations");
        } else {
          // Other error, log and return generic error message to user
          console.log(err);
          res.status(500).send("Error creating nation");
        }
        console.log(err);
      });
  }

  edit(req, res, next) {
    const nationID = req.params.id;
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    Nations.findById(nationID)
      .then((nation) => {
        res.render("editnation", {
          title: "The detail of nation",
          nation: nation,
          checkAdmin: checkAdmin,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          // Duplicate key error, return error message to user
          req.flash("error", "Nation name already exists");
          res.redirect("/nations");
        } else {
          // Other error, log and return generic error message to user
          console.log(err);
          res.status(500).send("Error creating nation");
        }
        console.log(err);
      });
  }
  update(req, res, next) {
    const nationID = req.params.id;
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    Nations.updateOne({ _id: nationID }, req.body)
      .then(() => {
        res.redirect("/nations");
      })
      .catch((err) => {
        if (err.code === 11000) {
          // Duplicate key error, return error message to user
          req.flash("error", "Nation name already exists");
          res.redirect("/nations");
        } else {
          // Other error, log and return generic error message to user
          console.log(err);
          res.status(500).send("Error creating nation");
        }
        console.log(err);
      });
  }

  delete(req, res, next) {
    const nationID = req.params.id;
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    if (!nationID) {
      return next(new Error("No nation ID provided"));
    }
    Nations.findByIdAndDelete({ _id: nationID })
      .then(() => {
        res.redirect("/nations");
      })
      .catch(next);
  }
}
module.exports = new nationController();
