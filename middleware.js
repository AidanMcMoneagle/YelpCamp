const { campgroundSchema } = require("./schemas.js"); //requiring
const { reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    //req.isAuthenticated() will return true if the user is logged in.
    req.session.returnTo = req.originalUrl; // storing the url requested in the session. Can access this property later when redirecting when the user has logged in
    req.flash("error", "you must be signed in");
    return res.redirect("/login");
  }
  next();
};

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// isAuthor middleware. will find the the campground in the database from the id in the route. Compares if the author id is the same as the id of the currently logged in user (req.user._id). If it is equal to currently logged in user next() is called to trigger next non error handling middleware. If is not equal will flash a message and redirect to show page.
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isLoggedIn = isLoggedIn;
module.exports.validateCampground = validateCampground;
module.exports.isAuthor = isAuthor;
module.exports.validateReview = validateReview;
module.exports.isReviewAuthor = isReviewAuthor;
