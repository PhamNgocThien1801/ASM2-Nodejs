const express = require("express");
const playerRouter = express.Router();
const playerController = require("../controllers/playerController");

playerRouter
  .route("/")
  .get(playerController.index)
  .post(playerController.create);

playerRouter
  .route("/edit/:id")
  .get(playerController.edit)
  .post(playerController.update);
playerRouter.route("/delete/:id").get(playerController.delete);
module.exports = playerRouter;
