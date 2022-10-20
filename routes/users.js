const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const {
  renderRegisterForm,
  createNewUserDB,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/users");

router.get("/register", renderRegisterForm);

router.post("/register", catchAsync(createNewUserDB));

router.get("/login", renderLoginForm);

// passport give us the middleware passport.authenticate() - look at the passport docs
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  login
);

router.get("/logout", logout);

module.exports = router;
