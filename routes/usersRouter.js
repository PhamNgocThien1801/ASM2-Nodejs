const express = require("express");
const { router } = require("../app");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const { notAuthenticated } = require("../config/notAuth");

userRouter
  .route("/")
  .get(notAuthenticated, userController.login)
  .post(notAuthenticated, userController.signIn);

userRouter.route("/logout").get(userController.signOut);

userRouter
  .route("/register")
  .get(notAuthenticated, userController.index)
  .post(notAuthenticated, userController.register);

module.exports = userRouter;
// router.use(bodyParser.json());
