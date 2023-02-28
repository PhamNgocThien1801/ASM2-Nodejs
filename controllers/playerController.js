const Players = require("../models/player");

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
    Players.find({})
      .then((players) => {
        res.render("player", {
          title: "The list of Players",
          players: players,
          clubList: clubData,
          locaList: locaData,
          isCaptainList: isCaptain,
        });
      })
      .catch(next);
    console.log(req.body);
  }
  create(req, res, next) {
    const player = new Players(req.body);
    player
      .save()
      .then(() => res.redirect("/"))
      .catch((err) => {
        console.log(err);
      });
  }

  edit(req, res, next) {
    const playerID = req.params.id;
    Players.findById(playerID)
      .then((player) => {
        res.render("editPlayer", {
          title: "The detail of Player",
          player: player,
          clubList: clubData,
          locaList: locaData,
          isCaptainList: isCaptain,
        });
      })
      .catch(next);
  }
  update(req, res, next) {
    const playerID = req.params.id;
    Players.updateOne({ _id: playerID }, req.body)
      .then(() => {
        res.redirect("/");
      })
      .catch(next);
  }
  // delete(res, req, next) {
  //   const playerID = req.params.id;
  //   Players.findByIdAndDelete({ _id: playerID })
  //     .then(() => {
  //       res.redirect("/players");
  //     })
  //     .catch(next);
  // }
  delete(req, res, next) {
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
