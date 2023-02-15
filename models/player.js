const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    image: {
      type: String,
      require: true,
    },
    club: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
var Players = mongoose.model("players", playerSchema);
module.exports = Players;
