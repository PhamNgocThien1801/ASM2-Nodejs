const express = require("express");
const { router } = require("../app");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const { notAuthenticated } = require("../config/notAuth");
var { ensureAuthenticated } = require("../config/auth");

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

userRouter.route("/account").get(ensureAuthenticated, userController.account);

userRouter
  .route("/account/edit/:accountID")
  .get(ensureAuthenticated, userController.editAccount)
  .post(ensureAuthenticated, userController.updateAccount);

userRouter
  .route("/account/listUser")
  .get(ensureAuthenticated, userController.listUser);

module.exports = userRouter;
