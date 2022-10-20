const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const { validateCampground, isAuthor } = require("../middleware");
const {
  showAllCampgrounds,
  newCampgroundForm,
  createNewCampgroundDB,
  showOneCampground,
  editCampgroundForm,
  editCampgroundDB,
  deleteOneCampground,
} = require("../controllers/campgrounds");

//Image Upload
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage: storage });

router
  .route("/")
  .get(catchAsync(showAllCampgrounds))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(createNewCampgroundDB)
  );
// .post(upload.array("image"), (req, res) => {
//   console.log(req.files, req.body);
//   res.send("IT WORKED");
// });

// router.get("/", catchAsync(showAllCampgrounds));

router.get("/new", isLoggedIn, newCampgroundForm);

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(editCampgroundForm));

router
  .route("/:id")
  .get(catchAsync(showOneCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(editCampgroundDB)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(deleteOneCampground));

module.exports = router;
