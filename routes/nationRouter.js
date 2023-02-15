const express = require("express");
const nationRouter = express.Router();
const nationController = require("../controllers/nationController");

nationRouter
  .route("/")
  .get(nationController.index)
  .post(nationController.create);

nationRouter
  .route("/edit/:id")
  .get(nationController.edit)
  .post(nationController.update);

nationRouter.route("/delete/:id").get(nationController.delete);

module.exports = nationRouter;
