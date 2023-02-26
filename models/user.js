const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    yob: {
      type: Number,
      require: true,
    },
    isAdmin: Boolean,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
