const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.createNewUserDB = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password); //User.register - takes new user we have just made and the password. Stores the hased password and salt aswell as the new user in the database. We do not need to call .save() like normally would.
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(() => {
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  }); // can be called on any route handler. logs out the user.
};
