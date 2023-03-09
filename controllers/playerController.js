const Players = require("../models/player");
const checkIsAdmin = require("../config/checkIsAdmin");
const notAuthenticated = require("../config/notAuth");
const Nations = require("../models/nation");

let clubData = [
  { id: "1", name: "Arsenal" },
  { id: "2", name: "Manchester United" },
  { id: "3", name: "Chelsea" },
  { id: "4", name: "Manchester City" },
  { id: "5", name: "PSG" },
  { id: "6", name: "Inter Milan" },
  { id: "7", name: "Real Madrid" },
  { id: "8", name: "Barcelona" },
];
let locaData = [
  { id: "1", name: "ST" },
  { id: "2", name: "CAM" },
  { id: "3", name: "LW" },
  { id: "4", name: "RW" },
  { id: "5", name: "CB" },
  { id: "6", name: "LB" },
  { id: "7", name: "GK" },
];
let isCaptain = [
  { id: "1", name: "Captain" },
  { id: "2", name: "Not Captain" },
];

class playerController {
  index(req, res, next) {
    let nations;
    Nations.find().then((nation) => {
      nations = nation;
    });
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    const name = req.query.name || "";
    const currentPage = Number(req.query.page) || 1;
    const perPage = 6;
    Players.find({ name: { $regex: name, $options: "i" } })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .then((players) => {
        Players.countDocuments({ name: { $regex: name, $options: "i" } })
          .then((count) => {
            res.render("player", {
              title: "The list of Players",
              players: players,
              clubList: clubData,
              locaList: locaData,
              isCaptainList: isCaptain,
              checkAdmin: checkAdmin,
              name: name,
              nations: nations,
              currentPage: currentPage,
              pages: Math.ceil(count / perPage),
            });
          })
          .catch(next);
      })
      .catch(next);
    console.log(req.body);
  }

  create(req, res, next) {
    let nations;
    Nations.find().then((nation) => {
      nations = nation;
    });
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    const player = new Players(req.body);
    player
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => {
        if (err.code === 11000) {
          // Duplicate key error, return error message to user
          req.flash("error", "Name already exists");
          res.redirect("/");
        } else {
          // Other error, log and return generic error message to user
          console.log(err);
          res.status(500).send("Error creating player");
        }
        console.log(err);
      });
  }

  edit(req, res, next) {
    let nations;
    Nations.find().then((nation) => {
      nations = nation;
    });
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    const playerID = req.params.id;
    Players.findById(playerID)
      .then((player) => {
        res.render("editPlayer", {
          title: "The detail of Player",
          player: player,
          clubList: clubData,
          locaList: locaData,
          isCaptainList: isCaptain,
          checkAdmin: checkAdmin,
          nations: nations,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          // Duplicate key error, return error message to user
          req.flash("error", "Name already exists");
          res.redirect("/");
        } else {
          // Other error, log and return generic error message to user
          console.log(err);
          res.status(500).send("Error creating player");
        }
        console.log(err);
      });
  }
  update(req, res, next) {
    let nations;
    Nations.find().then((nation) => {
      nations = nation;
    });
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    const playerID = req.params.id;
    Players.updateOne({ _id: playerID }, req.body)
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        Players.findById(playerID).then((player) => {
          res.render("editPlayer", {
            title: "The detail of Player",
            player: player,
            clubList: clubData,
            locaList: locaData,
            isCaptainList: isCaptain,
            checkAdmin: checkAdmin,
            nations: nations,
          });
        });
        if (err.code === 11000) {
          // Duplicate key error, return error message to user
          req.flash("error", "Name already exists");
          res.redirect("/");
        } else {
          // Other error, log and return generic error message to user
          console.log(err);
          res.status(500).send("Error creating player");
        }
        console.log(err);
      });
  }
  delete(req, res, next) {
    var checkAdmin = false;
    if (req.user && checkIsAdmin(req.user.isAdmin)) {
      checkAdmin = true;
    }
    const playerID = req.params.id;
    if (!playerID) {
      return next(new Error("No player ID provided"));
    }
    Players.findByIdAndDelete({ _id: playerID })
      .then(() => {
        res.redirect("/");
      })
      .catch(next);
  }
}
module.exports = new playerController();
