const Nations = require("../models/nation");

// let clubData = [
//   { id: "1", name: "Arsenal" },
//   { id: "2", name: "Manchester United" },
//   { id: "3", name: "Chelsea" },
//   { id: "4", name: "Manchester City" },
//   { id: "5", name: "PSG" },
//   { id: "6", name: "Inter Milan" },
//   { id: "7", name: "Real Madrid" },
//   { id: "8", name: "Barcelona" },
// ];
class nationController {
  index(req, res, next) {
    Nations.find({})
      .then((nations) => {
        res.render("nation", {
          title: "The list of nations",
          nations: nations,
          //   clubList: clubData,
        });
      })
      .catch(next);
    console.log(req.body);
  }
  create(req, res, next) {
    const nation = new Nations(req.body);
    nation
      .save()
      .then(() => res.redirect("/nations"))
      .catch((err) => {
        console.log(err);
      });
  }

  edit(req, res, next) {
    const nationID = req.params.id;
    Nations.findById(nationID)
      .then((nation) => {
        res.render("editnation", {
          title: "The detail of nation",
          nation: nation,
          //   clubList: clubData,
        });
      })
      .catch(next);
  }
  update(req, res, next) {
    const nationID = req.params.id;
    Nations.updateOne({ _id: nationID }, req.body)
      .then(() => {
        res.redirect("/nations");
      })
      .catch(next);
  }
  // delete(res, req, next) {
  //   const nationID = req.params.id;
  //   nations.findByIdAndDelete({ _id: nationID })
  //     .then(() => {
  //       res.redirect("/nations");
  //     })
  //     .catch(next);
  // }
  delete(req, res, next) {
    const nationID = req.params.id;
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
