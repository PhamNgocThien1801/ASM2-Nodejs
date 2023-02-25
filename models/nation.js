const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nationSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);
var Nations = mongoose.model("nations", nationSchema);
module.exports = Nations;
